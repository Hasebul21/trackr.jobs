import { Controller, Get } from '@nestjs/common';
import { ALL_PROVIDERS } from '../providers';
import {
  EXCLUDE_TITLE_KEYWORDS,
  INCLUDE_TITLE_KEYWORDS,
  PREFERRED_LOCATIONS,
  PREFERRED_TECHNOLOGIES,
} from '../config/preferences';

@Controller('settings')
export class SettingsController {
  @Get()
  getSettings() {
    return {
      providers: ALL_PROVIDERS.map((p) => ({
        name: p.name,
        label: p.label,
        reliable: p.reliable ?? false,
      })),
      preferences: {
        includeTitleKeywords: INCLUDE_TITLE_KEYWORDS,
        excludeTitleKeywords: EXCLUDE_TITLE_KEYWORDS,
        preferredLocations: PREFERRED_LOCATIONS,
        preferredTechnologies: PREFERRED_TECHNOLOGIES,
      },
    };
  }
}
