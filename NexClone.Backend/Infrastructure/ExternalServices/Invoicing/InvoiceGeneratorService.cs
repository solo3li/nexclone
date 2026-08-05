using System.IO;
using System.Threading.Tasks;
using NexClone.Backend.Core.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QRCoder;
using System;

namespace NexClone.Backend.Infrastructure.ExternalServices.Invoicing
{
    public class InvoiceGeneratorService : IInvoiceGeneratorService
    {
        public InvoiceGeneratorService()
        {
            // QuestPDF requires a license explicitly set
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice, string verifyUrlBase)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12).FontFamily(Fonts.Arial));

                    page.Header().Element(c => ComposeHeader(c, invoice));
                    page.Content().Element(c => ComposeContent(c, invoice, verifyUrlBase));
                    page.Footer().Element(c => ComposeFooter(c));
                });
            });

            return document.GeneratePdf();
        }

        private void ComposeHeader(IContainer container, Invoice invoice)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text($"Invoice #{invoice.InvoiceNumber}").FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);
                    column.Item().Text($"Date: {invoice.CreatedAt:d MMM yyyy}");
                    column.Item().Text($"Gateway: {invoice.PaymentGateway} ({invoice.PaymentMethod})");
                    if (!string.IsNullOrEmpty(invoice.TransactionId))
                    {
                        column.Item().Text($"Transaction ID: {invoice.TransactionId}").FontSize(10).FontColor(Colors.Grey.Medium);
                    }
                });

                row.ConstantItem(100).Height(50).Placeholder(); // Placeholder for Logo
            });
        }

        private void ComposeContent(IContainer container, Invoice invoice, string verifyUrlBase)
        {
            container.PaddingVertical(1, Unit.Centimetre).Column(column =>
            {
                column.Spacing(5);

                // Table
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn(1);
                        columns.RelativeColumn(1);
                        columns.RelativeColumn(1);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Description");
                        header.Cell().Element(CellStyle).AlignRight().Text("Unit Price");
                        header.Cell().Element(CellStyle).AlignRight().Text("Quantity");
                        header.Cell().Element(CellStyle).AlignRight().Text("Total");

                        static IContainer CellStyle(IContainer container)
                        {
                            return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        }
                    });

                    // Item
                    table.Cell().Element(CellStyle).Text(invoice.Subscription?.Plan?.Name ?? "Subscription Plan");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{invoice.SubTotal} {invoice.Currency}");
                    table.Cell().Element(CellStyle).AlignRight().Text("1");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{invoice.SubTotal} {invoice.Currency}");

                    static IContainer CellStyle(IContainer container)
                    {
                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                    }
                });

                // Totals
                column.Item().PaddingTop(10).AlignRight().Column(c =>
                {
                    c.Item().Text($"Subtotal: {invoice.SubTotal} {invoice.Currency}");
                    c.Item().Text($"Tax: {invoice.TaxAmount} {invoice.Currency}");
                    c.Item().Text($"Total: {invoice.TotalAmount} {invoice.Currency}").SemiBold().FontSize(14);
                });

                // QR Code & Stamp
                column.Item().PaddingTop(40).Row(row =>
                {
                    // QR Code
                    string verifyUrl = $"{verifyUrlBase}/verify-invoice/{invoice.VerificationToken}";
                    byte[] qrCodeBytes = GenerateQrCode(verifyUrl);

                    row.RelativeItem().Column(c =>
                    {
                        c.Item().Text("Scan to verify authenticity:").FontSize(10).FontColor(Colors.Grey.Medium);
                        if (qrCodeBytes != null)
                        {
                            c.Item().Width(80).Height(80).Image(qrCodeBytes);
                        }
                    });

                    // Stamp
                    string stampPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "nexmedia_paid_stamp.png");
                    if (File.Exists(stampPath))
                    {
                        row.ConstantItem(120).Height(120).Image(stampPath);
                    }
                });
            });
        }

        private void ComposeFooter(IContainer container)
        {
            container.AlignCenter().Text(x =>
            {
                x.Span("Page ");
                x.CurrentPageNumber();
                x.Span(" of ");
                x.TotalPages();
            });
        }

        private byte[] GenerateQrCode(string url)
        {
            try
            {
                using var qrGenerator = new QRCodeGenerator();
                using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
                using var qrCode = new PngByteQRCode(qrCodeData);
                return qrCode.GetGraphic(20);
            }
            catch
            {
                return null;
            }
        }
    }
}
