import PyPDF2
import glob

pdfs = ["AeroBay Advanced .pdf", "AeroBay Offerings_Standard.pdf", "AeroBay Premium.pdf", "basix.pdf"]
for pdf in pdfs:
    try:
        reader = PyPDF2.PdfReader(pdf)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        out_name = pdf.replace(".pdf", ".txt").replace(" ", "_")
        with open(out_name, "w") as f:
            f.write(text)
        print(f"Extracted {pdf} to {out_name}")
    except Exception as e:
        print(f"Failed {pdf}: {e}")
