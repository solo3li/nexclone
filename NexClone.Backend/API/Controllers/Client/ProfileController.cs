using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/profile")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly NexClone.Backend.Core.Interfaces.IMediaService _mediaService;

        public ProfileController(UserManager<ApplicationUser> userManager, NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            _userManager = userManager;
            _mediaService = mediaService;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            user.FullName = request.FullName ?? user.FullName;
            user.Country = request.Country ?? user.Country;

            if (request.ProfileImage != null)
            {
                using var stream = request.ProfileImage.OpenReadStream();
                string fileExtension = System.IO.Path.GetExtension(request.ProfileImage.FileName);
                string objectKey = $"profiles/{userId:N}/{Guid.NewGuid()}{fileExtension}";
                var imageUrl = await _mediaService.UploadFileAsync(stream, objectKey, request.ProfileImage.ContentType);
                user.ImageUrl = imageUrl;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "Profile updated successfully", ImageUrl = user.ImageUrl });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to change password. Please check your current password." });
            }

            return Ok(new { Message = "Password changed successfully" });
        }
    }

    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Country { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
