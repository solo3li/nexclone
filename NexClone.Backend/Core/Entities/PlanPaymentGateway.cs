using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    /// <summary>
    /// Pivot table linking Plans to Payment Gateways.
    /// Controls which payment gateway is available for a given plan and currency.
    /// </summary>
    public class PlanPaymentGateway
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlanId { get; set; }

        [Required]
        public int GatewayConfigId { get; set; }

        /// <summary>
        /// The currency this gateway handles for this plan. e.g. "EGP", "USD"
        /// </summary>
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = string.Empty;

        /// <summary>
        /// Optional display name shown to the user. e.g. "بطاقة بنكية", "PayPal"
        /// </summary>
        [MaxLength(100)]
        public string? DisplayName { get; set; }

        /// <summary>
        /// Whether this is the default/recommended gateway for this plan+currency combo.
        /// </summary>
        public bool IsDefault { get; set; } = false;

        /// <summary>
        /// Controls the display order in the checkout UI.
        /// </summary>
        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        [ForeignKey(nameof(PlanId))]
        public Plan Plan { get; set; } = null!;

        [ForeignKey(nameof(GatewayConfigId))]
        public PaymentGatewayConfig GatewayConfig { get; set; } = null!;
    }
}
