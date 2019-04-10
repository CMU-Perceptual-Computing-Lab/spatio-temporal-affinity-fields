var HDFilePath;
var HDFileName;
var HDFileSize;

var VGAFilePath;
var VGAFileName;
var VGAFileSize;

var KinectFilePath;
var KinectFileName;
var KinectFileSize;

$( document ).ready(function() {
    console.log( "ready!" );
	
	var parts = window.location.pathname.split( '/' );
	var datasetName0 = parts[parts.length-1].split('.html');
	datasetName = datasetName0[0];
	
	$.getJSON('/webdata/config/' + datasetName + '.json', function(json) {
		HDFilePath	 		= json.HDFilePath;
		HDFileName		 	= json.HDFileName;
		HDFileSize 			= json.HDFileSize;
		
		VGAFilePath			= json.VGAFilePath;
		VGAFileName			= json.VGAFileName;
		VGAFileSize			= json.VGAFileSize;
		
		KinectFilePath		= json.KinectFilePath;
		KinectFileName		= json.KinectFileName;
		KinectFileSize		= json.KinectFileSize;
		
		//console.log( "HDFileName: " + HDFileName );
	});
	
});

var tarLinkList = function(dataset,row,col){
	console.log('Row: ' + row + ', Column: ' + col);
	var tarFileLinkList = [];
	var tarFileSizeList = [];
	if(row==1){ 		// cam = 'HD'; 18*(col-1)+1 ~ 18*col + 1 
		for(i=18*(col-1)+1; i<=18*col + 1; i++){
			if(HDFileName[i])
			{
				tarFileLinkList.push(HDFilePath+'/'+HDFileName[i]);
				tarFileSizeList.push(HDFileSize[i]);
			}
		}
	}
	else if(row>1 && row <=6){ // cam = 'VGA';
		tarFileLinkList += [];
	}
	else if(row>6 && row <=8){ // cam = 'Kinect'
		tarFileLinkList += [];
	}
	else{
		console.log( "Error in tarLinkList!" );
	}
	
	
	//tarFileLinkList = ['/webdata/posefs4a/160224_ultimatum1/rawdata/hdimgs/hd_000XX_ideal_160224_ultimatum1.tar','/webdata/posefs4a/160224_ultimatum1/rawdata/hdimgs/hd_001XX_ideal_160224_ultimatum1.tar'];
	return [tarFileLinkList, tarFileSizeList];
}

 $('#download').click(function() {
	var table = document.getElementById("downloadtable"); 
	//console.log('table: ' + table);
	var parts = window.location.pathname.split( '/' );
	var datasetName0 = parts[parts.length-1].split('.html');
	var datasetName = datasetName0[0];
	
	for (var i = 0; i< table.rows.length-1; i++) { 
		row = table.rows[i];
		for (var j = 0; j<row.cells.length-1; j++) { 
			
			var rowIdx = i;
			var colIdx = j+1;
			
			var cell = '#downloadtable tr:eq('+i+') td:eq('+ j +')';
			var text = $(cell).text();
			var rgb = $(cell).css("background-color");	
			
			if (rgb)			
				rgb = rgb.match(/\d+/g);
			else
				continue;
			
			var r = parseInt(rgb[0]).toString(16);
			var g = parseInt(rgb[1]).toString(16);
			var b = parseInt(rgb[2]).toString(16);
			var hex = '#' + r + g + b;		
			
			if( hex.toLowerCase() == "#87CEFA".toLowerCase() ){		
				console.log('Row: ' + rowIdx + ', Column: ' + colIdx + ' ' + text + ' ' + hex);
				var downloadList = tarLinkList(datasetName,rowIdx,colIdx);
				
				console.log('downloadList: ' + downloadList);
				
				//download(downloadList);
			}
		}  
	}
 });



 $('#generate_sh').click(function() {
	var table = document.getElementById("downloadtable"); 
	//console.log('table: ' + table);
	
	var parts = window.location.pathname.split( '/' );
	var datasetName0 = parts[parts.length-1].split('.html');
	var datasetName = datasetName0[0];
   
	var str = [];	
	for (var i = 0; i< table.rows.length-1; i++) { 
		row = table.rows[i];
		for (var j = 0; j<row.cells.length-1; j++) { 
			
			var rowIdx = i;
			var colIdx = j+1;
			
			var cell = '#downloadtable tr:eq('+i+') td:eq('+ j +')';
			var size = $(cell).text();
			var rgb = $(cell).css("background-color");	
			
			if (rgb)			
				rgb = rgb.match(/\d+/g);
			else
				continue;
			
			var r = parseInt(rgb[0]).toString(16);
			var g = parseInt(rgb[1]).toString(16);
			var b = parseInt(rgb[2]).toString(16);
			var hex = '#' + r + g + b;	
					
			if( hex.toLowerCase() == "#87CEFA".toLowerCase() ){		
				console.log('Row: ' + rowIdx + ', Column: ' + colIdx);
				var info = tarLinkList(datasetName,rowIdx,colIdx);	
				var fileLinkList = info[0];
				var	fileSizeList = info[1];
				
				//console.log('fileLinkList: ' + fileLinkList);
				
				for( var idx=0;idx<fileLinkList.length;idx++){
					var temp = fileLinkList[idx].split( '/' );
					var tarfilename = temp[temp.length-1];
					//console.log('tarfilename: ' + tarfilename);
					//str.push( "wget -c -t 0 -O "  + tarfilename + " " + fileLinkList[idx] + "\t #"+ size +"\n");
					str.push( "wget -c -t 0 -O "  + tarfilename + " " + fileLinkList[idx] + "\t\t" + "#Size: "  + fileSizeList[idx] + "\n");
				}
			}
		}  
	}		

	//console.log('str: ' + str);
	
	if( str.length==0 )
		alert('Please select dataset first')
	else{
		str = $.unique(str);
		saveFileAs( datasetName + ".sh", str.join(""));	
	}
 });    


 $('#generate_bat').click(function() {
	var table = document.getElementById("downloadtable"); 
	console.log('table: ' + table);
	
	var parts = window.location.pathname.split( '/' );
	var datasetName0 = parts[parts.length-1].split('.html');
	var datasetName = datasetName0[0];
   
	var str = [];
	for (var i = 0; i< table.rows.length-1; i++) { 
		row = table.rows[i];
		for (var j = 0; j<row.cells.length-1; j++) { 
			
			var rowIdx = i;
			var colIdx = j+1;
			
			var cell = '#downloadtable tr:eq('+i+') td:eq('+ j +')';
			var size = $(cell).text();
			var rgb = $(cell).css("background-color");	
			
			if (rgb)			
				rgb = rgb.match(/\d+/g);
			else
				continue;
			
			var r = parseInt(rgb[0]).toString(16);
			var g = parseInt(rgb[1]).toString(16);
			var b = parseInt(rgb[2]).toString(16);
			var hex = '#' + r + g + b;	
				
			if( hex.toLowerCase() == "#87CEFA".toLowerCase() ){		
				console.log('Row: ' + rowIdx + ', Column: ' + colIdx);
								
				var info = tarLinkList(datasetName,rowIdx,colIdx);	
				var fileLinkList = info[0];
				var	fileSizeList = info[1];
				
				for( var idx=0;idx<fileLinkList.length;idx++){
					//str.push( "C:\\windows\\explorer.exe  " + fileLinkList[idx] + "\t REM"+ size +"\n");
					str.push( "C:\\windows\\explorer.exe  " + fileLinkList[idx] + "\n");
				}
			}
		}  
	}		   
	//console.log('str: ' + str);
	
	if(str.length==0)
		alert('Please select dataset first')
	else{
		str = $.unique(str);
		saveFileAs( datasetName + ".bat", str.join(""));	
	}
 });    


function getCheckedCheckboxesFor(checkboxName) {
		var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
		Array.prototype.forEach.call(checkboxes, function(el) {
			values.push(el.value);
		});
		return values;
	}	
	
function createDownloadLink(anchorSelector, str, fileName){
	if(window.navigator.msSaveOrOpenBlob) {
		var fileData = [str];
		blobObject = new Blob(fileData);
		$(anchorSelector).click(function(){
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	} else {
		var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
		$(anchorSelector).attr("download", fileName);               
		$(anchorSelector).attr("href", url);
	}
}


 var download = function(downloadList) {
   for(var i=0; i<downloadList.length; i++) {
	 //alert(i);
	 var iframe = $('<iframe style="visibility: collapse;"></iframe>');
	 $('body').append(iframe);
	 var content = iframe[0].contentDocument;
	 var form = '<form action="' + downloadList[i] + '" method="GET"></form>';
	 content.write(form);
	 $('form', content).submit();
	 setTimeout((function(iframe) {
	   return function() { 
		 iframe.remove(); 
	   }
	 })(iframe), 2000);
   }
 }
 
function saveFileAs(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
}


var myList=[{"Download":"HD",			"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(0~100)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
            {"Download":"VGA(101~200)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
            {"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"VGA(201~300)",	"0~1mins": "1.3G", "1~2mins": "1.3G", "2~3mins": "1.3G", "3~4mins": "1.3G", "4~5mins": "1.3G", "5~6mins": "1.3G", "6~7mins": "1.3G", "7~8mins": "1.3G", "8~9mins": "1.3G", "9~10mins": "1.3G"},
			{"Download":"Total size",	"0~1mins": "19.1TB"}];
			

// Builds the HTML Table out of myList json data from Ivy restful service.
 function buildHtmlTable() {
     var columns = addAllColumnHeaders(myList);
 
     for (var i = 0 ; i < myList.length ; i++) {
		 var row$ = $('<tr/>');
         for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
             var cellValue = myList[i][columns[colIndex]];
 
             if (cellValue == null) { cellValue = ""; }
 
			 if(colIndex==0)
				 row$.append($('<th/>').html(cellValue));
			 else
				 row$.append($('<td/>').html(cellValue));
				 
         }
         $("#excelDataTable").append(row$);
     }
	 
 }
 
 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 function addAllColumnHeaders(myList,selector)
 {
     var columnSet = [];
     var headerTr$ = $('<tr/>');
 
     for (var i = 0 ; i < myList.length ; i++) {
         var rowHash = myList[i];
         for (var key in rowHash) {
             if ($.inArray(key, columnSet) == -1){
                 columnSet.push(key);
                 headerTr$.append($('<th/>').html(key));
             }
         }
     }
     $("#excelDataTable").append(headerTr$);
 
     return columnSet;
 }

