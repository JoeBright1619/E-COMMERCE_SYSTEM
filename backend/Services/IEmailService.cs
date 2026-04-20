namespace backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task SendOrderConfirmationAsync(string to, string customerName, int orderId, decimal totalAmount);
    }
}
