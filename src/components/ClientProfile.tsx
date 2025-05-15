
import React, { useState } from 'react';
import { X, Upload, FileText, Image as ImageIcon, FilePlus, Link2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ClientDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'link';
  url: string;
  description?: string;
  tags?: string[];
  dateAdded: Date;
}

interface ClientProfileProps {
  client: any;
  open: boolean;
  onClose: () => void;
}

export default function ClientProfile({ client, open, onClose }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [documents, setDocuments] = useState<ClientDocument[]>([
    {
      id: '1',
      name: 'Briefing inicial',
      type: 'pdf',
      url: '/placeholder.svg',
      description: 'Documento com as diretrizes iniciais da marca',
      tags: ['briefing', 'marca'],
      dateAdded: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Paleta de cores',
      type: 'image',
      url: '/placeholder.svg',
      description: 'Cores oficiais da marca',
      tags: ['design', 'cores'],
      dateAdded: new Date('2024-02-15')
    },
    {
      id: '3',
      name: 'Guia de voz da marca',
      type: 'document',
      url: '/placeholder.svg',
      description: 'Documento com tom de voz e linguagem',
      tags: ['comunicação', 'conteúdo'],
      dateAdded: new Date('2024-03-05')
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddDocument = () => {
    // In a real app, this would open a file picker or handle file uploads
    const newDoc: ClientDocument = {
      id: (documents.length + 1).toString(),
      name: 'Novo documento',
      type: 'pdf',
      url: '/placeholder.svg',
      description: 'Descrição do documento',
      tags: ['novo'],
      dateAdded: new Date()
    };
    
    setDocuments([...documents, newDoc]);
    toast.success('Documento adicionado com sucesso!');
  };
  
  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Documento removido com sucesso!');
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-rose-500" />;
      case 'image':
        return <ImageIcon className="text-blue-500" />;
      case 'link':
        return <Link2 className="text-purple-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center glass"
                style={{ background: `${client.primaryColor}20` }}
              >
                <span 
                  className="text-2xl font-bold" 
                  style={{ color: client.primaryColor }}
                >
                  {client.name.charAt(0)}
                </span>
              </div>
              <div>
                <SheetTitle className="text-xl">{client.name}</SheetTitle>
                <SheetDescription>{client.industry}</SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalhes do cliente</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Nome da empresa</label>
                    <Input value={client.name} readOnly className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Indústria</label>
                    <Input value={client.industry} readOnly className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Frequência de posts</label>
                    <Input value={`${client.postsPerWeek} posts por semana`} readOnly className="mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Paleta de cores</h3>
                <div className="flex gap-3">
                  <div className="space-y-2">
                    <div 
                      className="w-12 h-12 rounded-lg" 
                      style={{ backgroundColor: client.primaryColor }}
                    />
                    <p className="text-xs text-center text-muted-foreground">Primária</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-12 h-12 rounded-lg" 
                      style={{ backgroundColor: client.secondaryColor }}
                    />
                    <p className="text-xs text-center text-muted-foreground">Secundária</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" style={{ color: client.primaryColor }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Observações</h3>
              <Textarea 
                placeholder="Adicione observações sobre o cliente..."
                className="min-h-[100px]"
              />
              <Button className="w-full">Salvar informações</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <Button onClick={handleAddDocument} className="gap-2">
                <FilePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Adicionar documento</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="group glass-dark rounded-lg p-4 hover:border-primary/30 border border-border/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <h4 className="text-sm font-medium">{doc.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.dateAdded).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-destructive/10 transition-opacity"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <X className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                    
                    {doc.description && (
                      <p className="text-xs text-muted-foreground mb-3">{doc.description}</p>
                    )}
                    
                    {doc.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">Nenhum documento encontrado.</p>
                </div>
              )}
            </div>
            
            <div className="glass-dark rounded-lg p-6 mt-6 border border-dashed border-border flex flex-col items-center justify-center text-center">
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Arraste e solte arquivos</h3>
              <p className="text-muted-foreground mb-4">ou clique para buscar em seu computador</p>
              <Button variant="outline">Selecionar arquivos</Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
