import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Image as ImageIcon, User, Bot, Loader2, X } from 'lucide-react';
import { CatProfile } from '../src/types';

interface AIChatProps {
  activeCat: CatProfile | undefined;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

const AIChat: React.FC<AIChatProps> = ({ activeCat }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your AI assistant for ${activeCat?.name || 'your cat'}. You can ask me questions or upload photos (like litter box checks 💩) for analysis!`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare contents
      const parts: any[] = [];
      
      if (userMessage.image) {
        // Extract base64 data (remove data:image/jpeg;base64, prefix)
        const base64Data = userMessage.image.split(',')[1];
        const mimeType = userMessage.image.split(';')[0].split(':')[1];
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
      
      if (userMessage.text) {
        parts.push({ text: userMessage.text });
      } else if (userMessage.image) {
        // If only image is sent, give it a default prompt context
        parts.push({ text: "Please analyze this image related to my cat's health or activity." });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
            role: 'user',
            parts: parts
        },
        config: {
            systemInstruction: `You are a friendly, helpful veterinary AI assistant for a cat tracker app. The current cat is named ${activeCat?.name || 'unknown'}. Provide concise, helpful advice about cat health, behavior (pee, poop patterns), and nutrition. If analyzing images of waste, be professional but descriptive. Use cat emojis occasionally.`
        }
      });

      const responseText = response.text || "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      }]);

    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the AI. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {/* Message Image */}
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden bg-black/10">
                  <img src={msg.image} alt="Upload" className="max-w-full h-auto max-h-64 object-contain" />
                </div>
              )}
              
              {/* Message Text */}
              {msg.text && (
                <p className={`whitespace-pre-wrap text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                  {msg.text}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100 flex items-center space-x-2">
                <Loader2 className="animate-spin text-orange-500" size={16} />
                <span className="text-xs text-gray-400 font-medium">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-20 z-10">
        {/* Image Preview Overlay */}
        {selectedImage && (
            <div className="absolute bottom-full left-4 mb-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative w-20 h-20">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-gray-700"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
        )}

        <div className="flex items-end gap-2">
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageSelect}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
            >
                <ImageIcon size={24} />
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about cat health or analyze a photo..."
                    className="w-full bg-transparent border-none focus:ring-0 py-3 text-sm max-h-32 resize-none text-gray-800 placeholder-gray-400"
                    rows={1}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className={`p-3 rounded-xl transition-all flex-shrink-0 shadow-md ${
                    (!input.trim() && !selectedImage) || isLoading
                        ? 'bg-gray-200 text-gray-400' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                }`}
            >
                <Send size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
