using System.IO;
using System.Threading.Tasks;
using NexClone.Backend.Core.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
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

        public async Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice)
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
                    page.Content().Element(c => ComposeContent(c, invoice));
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

                // Replaced placeholder with Company Info
                row.ConstantItem(150).AlignRight().Column(c =>
                {
                    c.Item().Text("NexMedia AI").FontSize(18).SemiBold().FontColor(Colors.Blue.Darken2);
                    c.Item().Text("support@nexmediaai.com").FontSize(10);
                });
            });
        }

        private void ComposeContent(IContainer container, Invoice invoice)
        {
            container.PaddingVertical(1, Unit.Centimetre).Column(column =>
            {
                column.Spacing(20);

                // Billed To Section
                column.Item().Row(row =>
                {
                    row.RelativeItem().Column(c =>
                    {
                        c.Item().Text("Billed To:").SemiBold().FontSize(12).FontColor(Colors.Grey.Darken2);
                        if (invoice.User != null)
                        {
                            c.Item().Text(invoice.User.FullName ?? invoice.User.Email).SemiBold();
                            c.Item().Text(invoice.User.Email);
                            if (!string.IsNullOrEmpty(invoice.User.PhoneNumber))
                            {
                                c.Item().Text($"Phone: {invoice.User.PhoneNumber}");
                            }
                            if (!string.IsNullOrEmpty(invoice.User.Country))
                            {
                                c.Item().Text($"Country: {invoice.User.Country}");
                            }
                        }
                        else
                        {
                            c.Item().Text("Customer details not available");
                        }
                    });
                });

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

                // Paid Stamp
                string stampPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "nexmedia_paid_stamp.png");
                if (File.Exists(stampPath))
                {
                    column.Item().PaddingTop(40).AlignRight().Height(120).Width(120).Image(stampPath);
                }
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
    }
}
