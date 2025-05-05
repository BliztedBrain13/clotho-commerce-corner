
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, File, Send, MessageSquare, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

interface Attachment {
  name: string;
  size: number;
  type: string;
}

interface Reply {
  id: string;
  adminId: string;
  adminName: string;
  message: string;
  date: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  attachments: Attachment[];
  date: string;
  read: boolean;
  replies: Reply[];
}

export function AdminMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("adminMessages") || "[]") as Message[];
    setMessages(storedMessages);
  }, []);

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if it wasn't already
    if (!message.read) {
      const updatedMessages = messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      );
      
      setMessages(updatedMessages);
      localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !reply.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new reply
    const newReply: Reply = {
      id: uuidv4(),
      adminId: user?.id || "admin",
      adminName: user?.name || "Administrator",
      message: reply.trim(),
      date: new Date().toISOString()
    };
    
    // Update selected message with new reply
    const updatedMessage = {
      ...selectedMessage,
      replies: [newReply, ...selectedMessage.replies]
    };
    
    // Update messages array
    const updatedMessages = messages.map(m => 
      m.id === selectedMessage.id ? updatedMessage : m
    );
    
    // Save to localStorage
    localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
    
    // Update state
    setMessages(updatedMessages);
    setSelectedMessage(updatedMessage);
    setReply("");
    
    setTimeout(() => {
      toast.success("Reply sent successfully");
      setIsSubmitting(false);
    }, 800);
  };

  // Function to download attachment
  const handleDownloadAttachment = (attachment: Attachment) => {
    // Create a blob with mock content based on file type
    let content = "";
    let dataType = "text/plain";
    
    // Generate dummy content based on file type
    if (attachment.type.startsWith("image/")) {
      // For images, create a small SVG placeholder
      content = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ddd"/><text x="50%" y="50%" font-family="Arial" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#333">Image Placeholder</text></svg>`;
      dataType = "image/svg+xml";
    } else if (attachment.type === "application/pdf") {
      // For PDFs, create a text file saying it's a PDF placeholder
      content = "This is a placeholder for a PDF file.";
      dataType = "text/plain";
    } else if (attachment.type.startsWith("video/")) {
      // For videos, create a text file saying it's a video placeholder
      content = "This is a placeholder for a video file.";
      dataType = "text/plain";
    } else {
      // For other types, create a generic placeholder text
      content = `This is a placeholder for file: ${attachment.name}`;
      dataType = "text/plain";
    }

    // Create a blob with the content
    const blob = new Blob([content], { type: dataType });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger click
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloading ${attachment.name}`);
  };

  const filteredMessages = messages.filter(message => {
    if (filter === "unread") return !message.read;
    if (filter === "read") return message.read;
    return true;
  });
  
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Customer Messages</h2>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread" | "read")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-muted/40">
            <h3 className="font-medium">Messages ({filteredMessages.length})</h3>
          </div>
          
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(message => (
                <div 
                  key={message.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                  } ${!message.read ? 'font-medium' : ''}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{message.userName || message.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(message.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-sm truncate">
                    {message.message || "(No message, attachments only)"}
                  </p>
                  
                  {message.attachments.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <File className="h-3 w-3" />
                      <span>{message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  {!message.read && (
                    <Badge variant="secondary" className="mt-2">New</Badge>
                  )}
                  
                  {message.replies.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{message.replies.length} repl{message.replies.length !== 1 ? 'ies' : 'y'}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No messages found
              </div>
            )}
          </div>
        </div>
        
        {/* Message Detail */}
        <div className="col-span-1 md:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.userName || "Customer"}</CardTitle>
                    <CardDescription>{selectedMessage.userEmail}</CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedMessage.date).toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Original Message */}
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    {selectedMessage.message ? (
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    ) : (
                      <p className="italic text-muted-foreground">(No message, attachments only)</p>
                    )}
                  </div>
                  
                  {selectedMessage.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Attachments:</h4>
                      {selectedMessage.attachments.map((attachment, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({Math.round(attachment.size / 1024)}KB)
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadAttachment(attachment)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Replies */}
                {selectedMessage.replies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Replies:</h4>
                    <div className="space-y-4">
                      {selectedMessage.replies.map(reply => (
                        <div key={reply.id} className="bg-primary/5 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{reply.adminName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(reply.date).toLocaleString()}
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reply Form */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Reply:</h4>
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleSendReply} 
                  disabled={!reply.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <div className="p-12 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select a message to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
