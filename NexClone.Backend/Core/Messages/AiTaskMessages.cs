using System;

namespace NexClone.Backend.Core.Messages
{
    public interface IAiTaskMessage
    {
        Guid HistoryId { get; set; }
        Guid UserId { get; set; }
    }

    public class AvatarVideoMessage : IAiTaskMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public byte[] ImageBytes { get; set; }
        public string ImageContentType { get; set; }
        public byte[] AudioBytes { get; set; }
        public string AudioContentType { get; set; }
        public string Prompt { get; set; }
    }

    public class LipSyncMessage : IAiTaskMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public byte[] VideoBytes { get; set; }
        public string VideoFileName { get; set; }
        public string VideoContentType { get; set; }
        public byte[] AudioBytes { get; set; }
        public string AudioFileName { get; set; }
        public string AudioContentType { get; set; }
    }
    public class TextToVoiceMessage : IAiTaskMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public string Text { get; set; }
        public string Language { get; set; }
        public string VoiceName { get; set; }
        public string StyleInstruction { get; set; }
        public string Quality { get; set; }
        public decimal Cost { get; set; }
        public int ChargedWalletTypeId { get; set; }
    }

    public class VoiceToTextMessage : IAiTaskMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public string FileId { get; set; }
        public bool Translate { get; set; }
        public string TargetLanguage { get; set; }
        public decimal Cost { get; set; }
        public int ChargedWalletTypeId { get; set; }
    }
}
