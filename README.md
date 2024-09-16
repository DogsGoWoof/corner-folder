# Corner Folder
Bookmarks and bookmark folders get out of hand easily when trying to organize them.  
"Has _this_ ever happened to you?"  
So this is a simplified UI for it. [XKCD - 927](https://imgs.xkcd.com/comics/standards_2x.png)  
Originally started as a practice project from Scrimba but refactored for general bookmark usage.  


## Getting Started  
#### Adding A New Page  
The only required field is the URL, but there's currently 
no check for whether the URL is valid.  
You can also use Autofill to grab the available context from 
the currently active tab. Category and Faovurite aren't affected. 
#### Search:  
By default the search looks for matches that contain the entered text.
To search by category or url the search should look like `category:Bookmark`,
or in general `<identifier>:<word>`.  
Currently edit and delete buttons don't work on searched pages 
that are marked as Favourite. They still function in the Favourites tab. This is due to the way I'm assigning the event listeners by grabbing elements by id but I don't have a solution as of yet.  
#### Data:  
All data is stored using the Chrome Storage API.


### Attributions  
Edit/Delete icons from [SVG Repo](https://www.svgrepo.com/)  

### Technologies Used  
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)    
- [Paint.NET](https://www.getpaint.net/) used for logo and message background  
Made with HTML, CSS, and JS.