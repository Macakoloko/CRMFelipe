import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          aria-label={t('language')}
        >
          <Globe className="h-5 w-5" />
          <span className="ml-2 text-xs font-medium">{language === 'en-GB' ? 'EN' : 'PT'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('en-GB')}
          className={language === 'en-GB' ? 'bg-primary/10' : ''}
        >
          🇬🇧 {t('britishEnglish')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('pt-BR')}
          className={language === 'pt-BR' ? 'bg-primary/10' : ''}
        >
          🇧🇷 {t('brazilianPortuguese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 