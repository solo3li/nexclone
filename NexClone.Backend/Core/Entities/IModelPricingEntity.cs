namespace NexClone.Backend.Core.Entities
{
    public interface IModelPricingEntity
    {
        int Id { get; set; }
        string ModelName { get; set; }
        string ProviderName { get; set; }
        string AllowedWallet { get; set; }
        bool IsActive { get; set; }
        decimal BaseCost { get; set; }
    }
}
