
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Upload, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully", {
        description: "We'll get back to you as soon as possible"
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFiles(null);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need assistance with your order? 
            We're here to help. Please fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">support@clothco.example</p>
              <p className="text-sm text-muted-foreground mt-2">
                We'll respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mt-2">
                Mon-Fri: 9am - 5pm EST
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                123 Fashion Street, Suite 100<br />
                New York, NY 10001
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="What is this regarding?" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Your message..." 
                  rows={6} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="files">Attachments</Label>
                <div className="border border-input rounded-md">
                  <label 
                    htmlFor="files" 
                    className="flex flex-col items-center justify-center p-6 cursor-pointer text-center"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-1">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports images, PDFs, and documents up to 5MB
                    </p>
                    <input 
                      id="files" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
                {files && (
                  <div className="text-sm">
                    {Array.from(files).map((file, i) => (
                      <p key={i} className="text-muted-foreground">
                        {file.name} ({Math.round(file.size / 1024)}KB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full md:w-auto"
              >
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> 
                    Send Message
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
