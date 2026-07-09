using System;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

public class Program {
    public static void Main() {
        string token = "ABC+DEF/GHI=JKL";
        string encoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        string decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(encoded));
        Console.WriteLine(encoded);
        Console.WriteLine(decoded);
    }
}
