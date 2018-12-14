function searchBooks() {
    var search = $("#search").val();
    
    $.get("/book", {search:search}, function(data){
        console.log("Back from the server with:", data);
        $("#login").hide();
        $("#bookReview").hide();
        $("#bookContainer").show();
        $("#bookDisplay").show();
        $("#bookDisplay").empty();
        
        $("head").append($("<link rel='stylesheet' href='stylesheets/book-list.css' type='text/css' id='booklistStyle'/>"));
        $("head").append($("<link rel='stylesheet' href='stylesheets/index.css' type='text/css' id='indexStyle'/>" ));
        
        data.forEach(function (book){
            console.log(book.cover_art);
            var item = 
        `<a value=${book.id} onclick="loadDetails()">
            <div class='image-block col-sm-2' style="background:url('${book.cover_art}') no-repeat center  top;background-size:cover">
                <p> See Details</p>
            </div>
        </a>`;
            $("#bookDisplay").append(item);
        });
    });
    
}

function getBooks(){  
    $.get("/books", function(data){
        
        $("#login").hide();
        $("#bookReview").hide();
        $("#bookContainer").show();
        $("#bookDisplay").show();
        $("#bookDisplay").empty();
        $('#loginStyle').remove();
            
        $("head").append($("<link rel='stylesheet' href='stylesheets/book-list.css' type='text/css' id='booklistStyle'/>"));
        $("head").append($("<link rel='stylesheet' href='stylesheets/index.css' type='text/css' id='indexStyle'/>" ));
        
        data.forEach(function (book){
            var item = 
        `<a onclick="loadDetails(${book.id})">
            <div class='image-block col-sm-2' style="background:url('${book.cover_art}') no-repeat center  top;background-size:cover">
                <p> See Details</p>
            </div>
        </a>`;
            $("#bookDisplay").append(item);
        })
    })
}

function loadDetails(bookId) {
    console.log("Loading details...");
    // Setup for reloading the page dynamically
    $("#bookContainer").hide();
    $("#bookReview").show();
    $('#booklistStyle').remove();
    
    console.log("BOOK_ID:" + bookId);
    
    $("#bookListStyle").remove();
    
    $("head").append($("<link rel='stylesheet' href='stylesheets/seeDetails.css' type='text/css' id='reviewStyle'/>" ));
    
    // this is where we will build the details page
    $.get("/info", {bookId:bookId}, function(book){
        console.log("Back from the server with:");
        bookInfo = book["0"];
        bookCover = `<img src="${bookInfo.cover_art}" class="rounded float-left" alt="..." id="cover">`;
        
        $("#book-cover").html(bookCover);
        $("#title").text(bookInfo.title);
        $("#author").text(bookInfo.author);
        $("#publisher").text(bookInfo.publisher);
        $("#isbn").text(bookInfo.isbn);
        $("#book_id").val(bookInfo.id);
        
    })
    
    
    // This is where we will get the data and load it into the page
    $.get("/review", {bookId:bookId}, function(data){
        console.log("Back from the server with:");
        console.log(data);
        $("#reviews").empty();
        data.forEach(function (review){
           var reviewBlock = `
        <div class="reviews">
            <div class="row blockquote review-item">
                    <div class="col-md-3 text-center">
                        <img class="rounded-circle reviewer" src="https://standaloneinstaller.com/upload/avatar.png">
                        <div class="caption">
                        <small id = "display_name"> by ${review.display_name}</small>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <h4 id="review_title">${review.title}</h4>
                        <div class="ratebox text-center" data-id="0" data-rating="5"></div>
                        <p class='review-text'>${review.review}</p>
                        <p class='rating-text'>${review.rating}</p>
                        <br>
                        <p class='review-text'> Would Recommend?: </p>`

        if (review.would_recommend){
           reviewBlock += `<i class="fa fa-thumbs-up"></i>`
        }
        else{
            reviewBlock += `<i class="fa fa-thumbs-down"></i>`
        }
            reviewBlock += `</div>
                        </div>
                    </div>`
            
            $("#reviews").append(reviewBlock);
        });
    });
}

