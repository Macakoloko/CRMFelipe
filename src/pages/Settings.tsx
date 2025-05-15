import React, { useState } from 'react';
import { useTheme, themeOptions, logoOptions } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { HslColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Paintbrush, Type, Image, Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HSLToString, stringToHSL } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { 
    colors, 
    setColors, 
    logo, 
    setLogo, 
    applyTheme, 
    currentTheme,
    customText,
    setCustomText,
    useTextLogo,
    setUseTextLogo
  } = useTheme();
  
  const { language, setLanguage, t } = useLanguage();
  
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [logoText, setLogoText] = useState(customText);

  const handleThemeSelection = (themeName: string) => {
    applyTheme(themeName as keyof typeof themeOptions);
  };

  const handleLogoSelection = (logoPath: string) => {
    const selectedLogo = logoOptions.find(l => l.path === logoPath);
    if (selectedLogo) {
      setLogo(selectedLogo);
    }
  };

  const handleColorChange = (color: { h: number; s: number; l: number }, colorKey: keyof typeof colors) => {
    setColors({
      ...colors,
      [colorKey]: HSLToString(color)
    });
  };

  const handleLogoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoText(e.target.value);
  };

  const handleLogoTextSave = () => {
    setCustomText(logoText);
  };

  const handleLogoTypeChange = (checked: boolean) => {
    setUseTextLogo(checked);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t('settings')}</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          <TabsTrigger value="account">{t('account')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('colorTheme')}</CardTitle>
              <CardDescription>
                {t('chooseTheme')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('predefinedThemes')}</h3>
                  <RadioGroup 
                    value={currentTheme} 
                    onValueChange={handleThemeSelection}
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(themeOptions).map(([name, theme]) => (
                      <div key={name} className="flex items-start space-x-2">
                        <RadioGroupItem value={name} id={`theme-${name}`} />
                        <div className="grid gap-1.5">
                          <Label htmlFor={`theme-${name}`} className="capitalize">{name}</Label>
                          <div className="flex space-x-1">
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: `hsl(${theme.primary})` }} 
                            />
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: `hsl(${theme.secondary})` }} 
                            />
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: `hsl(${theme.background})` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('customizeColors')}</h3>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => applyTheme(currentTheme as keyof typeof themeOptions)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{t('resetToCurrentTheme')}</span>
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">{t('primaryColor')}</Label>
                        <Popover open={activeColor === 'primary'} onOpenChange={(open) => setActiveColor(open ? 'primary' : null)}>
                          <PopoverTrigger asChild>
                            <div className="relative w-full h-10 rounded-md cursor-pointer mb-2 flex items-center justify-end p-2" 
                              style={{ backgroundColor: `hsl(${colors.primary})` }}>
                              <Paintbrush className="h-4 w-4 text-white/80" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side="bottom" align="start" className="w-auto p-3">
                            <HslColorPicker 
                              color={stringToHSL(colors.primary)} 
                              onChange={(color) => handleColorChange(color, 'primary')} 
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">{t('secondaryColor')}</Label>
                        <Popover open={activeColor === 'secondary'} onOpenChange={(open) => setActiveColor(open ? 'secondary' : null)}>
                          <PopoverTrigger asChild>
                            <div className="relative w-full h-10 rounded-md cursor-pointer mb-2 flex items-center justify-end p-2" 
                              style={{ backgroundColor: `hsl(${colors.secondary})` }}>
                              <Paintbrush className="h-4 w-4 text-white/80" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side="bottom" align="start" className="w-auto p-3">
                            <HslColorPicker 
                              color={stringToHSL(colors.secondary)} 
                              onChange={(color) => handleColorChange(color, 'secondary')} 
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">{t('background')}</Label>
                        <Popover open={activeColor === 'background'} onOpenChange={(open) => setActiveColor(open ? 'background' : null)}>
                          <PopoverTrigger asChild>
                            <div className="relative w-full h-10 rounded-md cursor-pointer mb-2 flex items-center justify-end p-2" 
                              style={{ backgroundColor: `hsl(${colors.background})` }}>
                              <Paintbrush className="h-4 w-4 text-white/80" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side="bottom" align="start" className="w-auto p-3">
                            <HslColorPicker 
                              color={stringToHSL(colors.background)} 
                              onChange={(color) => handleColorChange(color, 'background')} 
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">{t('cards')}</Label>
                        <Popover open={activeColor === 'card'} onOpenChange={(open) => setActiveColor(open ? 'card' : null)}>
                          <PopoverTrigger asChild>
                            <div className="relative w-full h-10 rounded-md cursor-pointer mb-2 flex items-center justify-end p-2" 
                              style={{ backgroundColor: `hsl(${colors.card})` }}>
                              <Paintbrush className="h-4 w-4 text-white/80" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side="bottom" align="start" className="w-auto p-3">
                            <HslColorPicker 
                              color={stringToHSL(colors.card)} 
                              onChange={(color) => handleColorChange(color, 'card')} 
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {t('clickToCustomize')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('language')}</CardTitle>
              <CardDescription>
                {t('chooseLanguage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={language} 
                onValueChange={(val) => setLanguage(val as 'en-GB' | 'pt-BR')}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en-GB" id="language-en" />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Label htmlFor="language-en" className="font-medium">
                      {t('britishEnglish')}
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pt-BR" id="language-pt" />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Label htmlFor="language-pt" className="font-medium">
                      {t('brazilianPortuguese')}
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('logo')}</CardTitle>
              <CardDescription>
                {t('chooseIdentity')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-text-logo" 
                    checked={useTextLogo} 
                    onCheckedChange={handleLogoTypeChange}
                  />
                  <Label htmlFor="use-text-logo">{t('useTextInsteadOfLogo')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  {useTextLogo ? (
                    <Type className="h-5 w-5 text-primary" />
                  ) : (
                    <Image className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {useTextLogo ? t('textModeActive') : t('imageModeActive')}
                  </span>
                </div>
              </div>
              
              {useTextLogo ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="logo-text">{t('logoText')}</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="logo-text" 
                        value={logoText} 
                        onChange={handleLogoTextChange} 
                        placeholder={t('typeCompanyName')}
                      />
                      <Button onClick={handleLogoTextSave} className="shrink-0">
                        <Check className="h-4 w-4 mr-2" />
                        {t('save')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="mb-2 text-sm text-muted-foreground">{t('preview')}:</div>
                    <div className="p-4 bg-card rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold">{logoText}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {logoOptions.map((logoOption) => (
                    <div 
                      key={logoOption.path}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                        logo.path === logoOption.path ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => handleLogoSelection(logoOption.path)}
                    >
                      <div className="aspect-video flex items-center justify-center bg-card rounded-md mb-2">
                        <img 
                          src={logoOption.path} 
                          alt={logoOption.name} 
                          className="max-h-12 max-w-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{logoOption.name}</span>
                        {logo.path === logoOption.path && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm text-center">
                      {t('customUpload')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t('accountInfo')}</CardTitle>
              <CardDescription>
                {t('manageProfile')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('futureUpdate')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications')}</CardTitle>
              <CardDescription>
                {t('configureNotifications')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('futureUpdate')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 