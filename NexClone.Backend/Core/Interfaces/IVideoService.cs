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
        /// Starts the lip-sync task.
        /// </summary>
        /// <param name="videoFile">The driving video.</param>
        /// <param name="audioFile">The driving audio.</param>
        /// <returns>A tuple indicating success, task ID, and error message if any.</returns>
        Task<(bool Success, string TaskId, string ErrorMessage)> StartLipSyncAsync(IFormFile videoFile, IFormFile audioFile);

        /// <summary>
        /// Checks the status of a pending CometAPI task.
        /// </summary>
        /// <param name="taskId">The ID returned from the Start method.</param>
        /// <returns>A tuple with status ("processing", "succeeded", "failed"), output URL, and error message.</returns>
        Task<(string Status, string OutputUrl, string ErrorMessage)> CheckTaskStatusAsync(string taskId);
    }
}
