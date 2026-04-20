using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings["Host"] ?? "smtp.example.com";
            var port = int.Parse(smtpSettings["Port"] ?? "587");
            var username = smtpSettings["Username"] ?? "user@example.com";
            var password = smtpSettings["Password"] ?? "password";
            var from = smtpSettings["From"] ?? "noreply@cagura.com";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            if (isHtml)
                bodyBuilder.HtmlBody = body;
            else
                bodyBuilder.TextBody = body;

            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(username, password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // In a real app, log this error
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }
        }

        public async Task SendOrderConfirmationAsync(string to, string customerName, int orderId, decimal totalAmount)
        {
            var subject = $"Order Confirmation - CAGURA #{orderId}";
            var body = $@"
                <h1>Thank you for your order, {customerName}!</h1>
                <p>We've received your order and are processing it.</p>
                <p><strong>Order ID:</strong> #{orderId}</p>
                <p><strong>Total Amount:</strong> ${totalAmount:F2}</p>
                <p>You can view your order status in your dashboard.</p>
                <br/>
                <p>Best regards,<br/>The CAGURA Team</p>";

            await SendEmailAsync(to, subject, body, true);
        }
    }
}
