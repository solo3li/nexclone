using System;
using System.IO;
using System.Text;

class Program {
    static void Main() {
        var ms = new MemoryStream();
        var writer = new BinaryWriter(ms);
        writer.Write(Encoding.ASCII.GetBytes("RIFF"));
        Console.WriteLine(ms.Length);
    }
}
