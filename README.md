# Testing was done using GitHub pages but I have renamed this repository and it is no longer a GitHub pages repository

This link works OK without xdomainProxyUrl option passed to the WebViewer initializer:
https://benrobot.github.io/?pdfToManipulate=resources%2FThis_pdf_file_needs_a_coverpage_and_watermarks.pdf&pdfCoverPage=%2Fresources%2FThis_is_a_cover_page.pdf

This link shows that stuff breaks when xdomainProxyUrl option is passed to the WebViewer initializer:
https://benrobot.github.io/?pdfToManipulate=resources%2FThis_pdf_file_needs_a_coverpage_and_watermarks.pdf&pdfCoverPage=%2Fresources%2FThis_is_a_cover_page.pdf&includeXDomainJsOption=true

### PdfManipulation
Testing functionality from PDFNetJs for staping a PDF and adding a cover sheet; all on the client/browser side.
