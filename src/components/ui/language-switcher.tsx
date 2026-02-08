import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation('common');

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const getCurrentLanguageLabel = () => {
        return i18n.language === 'es' ? 'Español' : 'English';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    <span className="mr-2">🇺🇸</span>
                    {t('language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('es')}>
                    <span className="mr-2">🇪🇸</span>
                    {t('language.spanish')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
