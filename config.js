(function() {
    $(document).on('documentLoaded', function() {
        PDFNet.initialize().then(function(){
            var doc = readerControl.docViewer.getDocument();
            
            doc.getPDFDoc().then(function(pdfDoc){
                // Run our script
                runCustomViewerCode(pdfDoc).then(function(){
                    // load the cover document
                    var partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever("/resources/This_is_a_cover_page.pdf", {useDownloader: false});
                    var coverDoc = new CoreControls.Document(null, "pdf");
                    var coverDocReady = function() {
                        // copy page 1 from coverDoc to the beginning of doc
                        // insertPages will automatically update the structure in WebViewer
                        doc.insertPages(coverDoc, [1], 1).then(function() {
                            // Since pages changed before we still need to make sure all pages are redrawn
                            // Refresh the cache with the newly updated document
                            readerControl.docViewer.refreshAll();

                            // Update viewer with changes
                            readerControl.docViewer.updateView();
                        });
                    };
                    // Note: since initPDFWorkerTransports has already been called by WebViewer constructor and PDFNet.initialize
                    // it doesn't require any arguments.
                    coverDoc.loadAsync(partRetriever, coverDocReady, {workerTransportPromise: CoreControls.initPDFWorkerTransports()});	
                });
            });
        });
    });

    var runCustomViewerCode = function(pdfDoc)
    {
        function* main()
        {
            var doc = pdfDoc;
            doc.lock();
            
            // Example 1) Add text stamp to all pages, then remove text stamp from odd pages. 
            try 
            {
                // start stack-based deallocation with startDeallocateStack. Later on when endDeallocateStack is called,
                // all objects in memory that were initialized since the most recent startDeallocateStack call will be
                // cleaned up. Doing this makes sure that memory growth does not get too high.
                yield PDFNet.startDeallocateStack();

                var stamper = yield PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_relative_scale, 0.5, 0.5); //Stamp size is relative to the size of the crop box of the destination page
                stamper.setAlignment(PDFNet.Stamper.HorizontalAlignment.e_horizontal_center, PDFNet.Stamper.VerticalAlignment.e_vertical_center);

                var redColorPt = yield PDFNet.ColorPt.init(1, 0, 0);
                stamper.setFontColor(redColorPt);
                var pgSet = yield PDFNet.PageSet.createRange(1, (yield doc.getPageCount()));
                stamper.stampText(doc, "If you are reading this\nthis is an even page", pgSet);
                var oddPgSet = yield PDFNet.PageSet.createFilteredRange(1, (yield doc.getPageCount()), PDFNet.PageSet.Filter.e_odd);
                // delete all text stamps in odd pages
                PDFNet.Stamper.deleteStamps(doc, oddPgSet);

                yield PDFNet.endDeallocateStack();
            } catch (err) {
                console.log(err.stack)
                ret = 1;
            }
        }
        
        return PDFNet.runGeneratorWithCleanup(main());
    }
})();
//# sourceURL=config.js