import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/LanguageContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTeamVerified, setIsTeamVerified] = useState(false);
  
  const { register, verifyTeamId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleVerifyTeam = async () => {
    setIsVerifying(true);
    try {
      const isValid = await verifyTeamId(teamId);
      setIsTeamVerified(isValid);
      if (isValid) {
        toast({
          title: t('teamVerified'),
          description: t('teamVerifiedMessage'),
        });
      } else {
        toast({
          title: t('teamNotFound'),
          description: t('teamNotFoundMessage'),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t('teamVerificationError'),
        description: t('teamVerificationErrorMessage'),
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreatingNewTeam && !isTeamVerified) {
      toast({
        title: t('teamNotVerified'),
        description: t('teamNotVerifiedMessage'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, isCreatingNewTeam ? '' : teamId);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('errorCreatingAccount'),
        description: t('errorCreatingAccountMessage'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t('registration')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t('personName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={t('teamId')}
                  value={teamId}
                  onChange={(e) => {
                    setTeamId(e.target.value);
                    setIsTeamVerified(false);
                  }}
                  disabled={isLoading || isCreatingNewTeam}
                  required={!isCreatingNewTeam}
                />
                <Button 
                  type="button" 
                  onClick={handleVerifyTeam}
                  disabled={isLoading || isCreatingNewTeam || !teamId || isVerifying}
                >
                  {isVerifying ? t('verifying') : t('verify')}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="createNewTeam"
                checked={isCreatingNewTeam}
                onChange={(e) => {
                  setIsCreatingNewTeam(e.target.checked);
                  if (e.target.checked) {
                    setIsTeamVerified(false);
                    setTeamId('');
                  }
                }}
                className="rounded border-gray-300"
                disabled={isLoading}
              />
              <label htmlFor="createNewTeam" className="text-sm">
                {t('createNewTeam')}
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || (!isCreatingNewTeam && !isTeamVerified)}
            >
              {isLoading ? t('registering') : t('register')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 