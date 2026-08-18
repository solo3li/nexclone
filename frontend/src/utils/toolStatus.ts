export interface ToolStatusInfo {
  status: 'active' | 'maintenance' | 'coming_soon' | 'inactive';
  isMaintenanceMode: boolean;
  isComingSoon: boolean;
  isActive: boolean;
}

export const TOOL_CANONICAL_KEYS: Record<string, string[]> = {
  "text-to-video": ["text-to-video", "kling_text2video", "vidu_text2video"],
  "image-to-video": ["image-to-video", "kling_avatar_image2video", "vidu_image2video"],
  "reference-to-video": ["reference-to-video", "kling_reference2video"],
  "advanced-lip-sync": ["advanced-lip-sync", "kling_advanced_lip_sync", "vidu_advanced_lip_sync", "lip-sync", "lipsync"],
  "motion-control": ["motion-control", "kling_motion_control"],
  "text-to-image": ["text-to-image", "flux_text2image"],
  "text-to-voice": ["text-to-voice"],
  "voice-to-text": ["voice-to-text"],
};

export function resolveToolStatus(toolIdOrRoute: string, toolConfigs: Record<string, any> | null): ToolStatusInfo {
  if (!toolConfigs || Object.keys(toolConfigs).length === 0) {
    return { status: 'active', isMaintenanceMode: false, isComingSoon: false, isActive: true };
  }

  // Normalize tool id from route or id
  const idClean = toolIdOrRoute.replace(/^\/tools\//, '').replace(/^\//, '').split('/')[0];
  const candidateKeys = TOOL_CANONICAL_KEYS[idClean] || [idClean];

  let selectedConfig: any = null;
  for (const key of candidateKeys) {
    if (toolConfigs[key]) {
      const cfg = toolConfigs[key];
      if (cfg.isMaintenanceMode || cfg.isComingSoon || cfg.isActive === false) {
        selectedConfig = cfg;
        break;
      }
      if (!selectedConfig) {
        selectedConfig = cfg;
      }
    }
  }

  if (!selectedConfig) {
    const fuzzyKey = Object.keys(toolConfigs).find(k => 
      k.toLowerCase() === idClean.toLowerCase() ||
      k.replace(/-/g, '_') === idClean.replace(/-/g, '_') ||
      k.includes(idClean) || idClean.includes(k)
    );
    if (fuzzyKey) {
      selectedConfig = toolConfigs[fuzzyKey];
    }
  }

  if (!selectedConfig) {
    return { status: 'active', isMaintenanceMode: false, isComingSoon: false, isActive: true };
  }

  if (selectedConfig.isMaintenanceMode) {
    return { status: 'maintenance', isMaintenanceMode: true, isComingSoon: false, isActive: selectedConfig.isActive ?? true };
  }
  if (selectedConfig.isComingSoon) {
    return { status: 'coming_soon', isMaintenanceMode: false, isComingSoon: true, isActive: selectedConfig.isActive ?? true };
  }
  if (selectedConfig.isActive === false) {
    return { status: 'inactive', isMaintenanceMode: false, isComingSoon: false, isActive: false };
  }

  return { status: 'active', isMaintenanceMode: false, isComingSoon: false, isActive: true };
}
