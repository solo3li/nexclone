namespace NexClone.Backend.Core.Entities
{
    public enum AiToolType
    {
        TextToVoice,
        VoiceToText,
        AvatarToVideo,
        LipSync,
        MotionControl,
        TextToVideo,
        ImageToVideo,
        ReferenceToVideo,
        TextToImage
    }

    public static class AiToolTypeHelper
    {
        private static readonly Dictionary<string, AiToolType> ToolIdMap = new(StringComparer.OrdinalIgnoreCase)
        {
            ["text-to-voice"] = AiToolType.TextToVoice,
            ["tts"] = AiToolType.TextToVoice,
            ["voice-to-text"] = AiToolType.VoiceToText,
            ["vtt"] = AiToolType.VoiceToText,
            ["stt"] = AiToolType.VoiceToText,
            ["kling_avatar_image2video"] = AiToolType.AvatarToVideo,
            ["avatar-to-video"] = AiToolType.AvatarToVideo,
            ["advanced-lip-sync"] = AiToolType.LipSync,
            ["vidu_advanced_lip_sync"] = AiToolType.LipSync,
            ["lipsync"] = AiToolType.LipSync,
            ["lip-sync"] = AiToolType.LipSync,
            ["motion-control"] = AiToolType.MotionControl,
            ["kling_motion_control"] = AiToolType.MotionControl,
            ["text-to-video"] = AiToolType.TextToVideo,
            ["image-to-video"] = AiToolType.ImageToVideo,
            ["reference-to-video"] = AiToolType.ReferenceToVideo,
            ["text-to-image"] = AiToolType.TextToImage,
            ["image-to-image"] = AiToolType.TextToImage,
        };

        public static AiToolType? FromString(string toolId)
        {
            if (ToolIdMap.TryGetValue(toolId, out var type)) return type;
            return null;
        }
    }
}