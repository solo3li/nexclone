using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NexClone.Backend.Application.Services;
using System;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    /// <summary>
    /// Public endpoint for tracking affiliate referral clicks.
    /// No authentication required — visitors hit this before registering.
    /// </summary>
    [Route("api/affiliate-track")]
    [ApiController]
    [EnableRateLimiting("ApiPolicy")]
    public class AffiliateTrackController : ControllerBase
    {
        private readonly AffiliateService _affiliateService;

        public AffiliateTrackController(AffiliateService affiliateService)
        {
            _affiliateService = affiliateService;
        }

        /// <summary>
        /// Records a click on an affiliate referral link.
        /// Returns a session token stored in a cookie by the frontend (Next.js middleware).
        /// </summary>
        [HttpGet("click")]
        public async Task<IActionResult> Click([FromQuery] string ref_code)
        {
            if (string.IsNullOrWhiteSpace(ref_code))
                return BadRequest(new { error = "Referral code is required." });

            var sessionToken = await _affiliateService.TrackClickAsync(ref_code);

            if (sessionToken == null)
                return Ok(new { tracked = false });

            return Ok(new { tracked = true, sessionToken });
        }
    }
}
