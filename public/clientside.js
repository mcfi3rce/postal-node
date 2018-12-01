function loadBooks() {
    var search = $("#search").val();
    
    $.get("/books", {search:search}, function(data){
        console.log("Back from the server with:");
        
        data.forEach(function (book){
            console.log(book.cover_art);
            var item = 
        `<a value=${book.id} onclick="loadDetails()">
            <div class='image-block col-sm-2 style="background:url(${book.cover_art})" no-repeat center  top;background-size:cover'>
                <p> See Details</p>
            </div>
        </a>`;
            $("#bookDisplay").append(item);
        })
    })
    
}

function loadDetails() {
    
    console.log("Loading details...");
    // Setup for reloading the page dynamically
    $("#bookContainer").hide();
    $("#bookReview").show();
    
    console.log("BOOK_ID:" + $("book_id").val);
    
    $("head").append($("<link rel='stylesheet' href='stylesheets/seeDetails.css' type='text/css'/>"));
    
    
    // This is where we will get the data and load it into the page
    $.get("/review", {id:1}, function(data){
        console.log("Back from the server with:");
        console.log(data);
    })
    
    var bookCover = `<img src="https://images.gr-assets.com/books/1375776480l/43615.jpg" class="rounded float-left" alt="..." id="cover">`;
    
    
    $("#book-cover").append(bookCover);
    
    
    
}