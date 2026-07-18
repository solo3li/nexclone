using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IVideoService
    {
        /// <summary>
        /// Starts the avatar image-to-video generation task.
        /// </summary>
        /// <param name="imageFile">The portrait image.</param>
        /// <returns>A tuple indicating success, task ID, and error message if any.</returns>
        Task<(bool Success, string TaskId, string ErrorMessage)> StartAvatarImageToVideoAsync(IFormFile imageFile, IFormFile? audioFile = null, string prompt = "The speaker talks naturally to camera");

        /// <summary>
        /// Processes the lip sync asynchronously in the background.
        /// </summary>
        void ProcessLipSyncBackgroundAsync(Guid historyId, string videoUrl, string audioUrl, Guid userId);

        /// <summary>
        /// Checks the status of a pending CometAPI task.
        /// </summary>
        /// <param name="taskId">The ID returned from the Start method.</param>
        /// <returns>A tuple with status ("processing", "succeeded", "failed"), output URL, and error message.</returns>
        Task<(string Status, string OutputUrl, string ErrorMessage)> CheckTaskStatusAsync(string taskId);
    }
}
