
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageSquare, Send, File, X, Paperclip } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function ProfileMessages() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size (limit to 5MB per file)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed the 5MB size limit and were not added`);
        const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
        setAttachments(prev => [...prev, ...validFiles]);
        return;
      }
      
      // Add files
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) {
      toast.error("Please enter a message or attach a file");
      return;
    }
    
    setIsSubmitting(true);
    
    // Get existing messages from localStorage or initialize empty array
    const existingMessages = JSON.parse(localStorage.getItem("adminMessages") || "[]");
    
    // Create new message object with attachments info
    const newMessage = {
      id: uuidv4(),
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      message: message.trim(),
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        // In a real app, we would upload the file to storage and store the URL
        // For demo purposes, we'll just store the file details
      })),
      date: new Date().toISOString(),
      read: false,
      replies: []
    };
    
    // Add new message to the beginning of the array
    const updatedMessages = [newMessage, ...existingMessages];
    
    // Save to localStorage
    localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
    
    // Simulate sending message
    setTimeout(() => {
      toast.success("Message sent to admin");
      setMessage("");
      setAttachments([]);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Admin
        </CardTitle>
        <CardDescription>
          Send a message to the admin team. We'll get back to you via email.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="attachment">Attachments</Label>
                <span className="text-xs text-muted-foreground">Max 5MB per file</span>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
                Attach Files
              </Button>
              
              <input
                ref={fileInputRef}
                id="attachment"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center gap-2 text-sm truncate">
                        <File className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(file.size / 1024)}KB)
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
