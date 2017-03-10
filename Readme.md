# Water Import

Relevant URLS
[Trello Board](https://trello.com/c/tBkrmqEv/48-what-s-in-my-water)
[Slack](https://codeforireland.slack.com)

Need to set your connection string in a .env file with  
```

'WATER_CONNECTION_DB' = 'mongodb://localhost..'

```

Uses Recursefiles.js to build array of xls objects to put them in the right year, county and type.
Fix the naming problems 

```

node recursefiles.js  | find "county: ''"

node recursefiles.js > xlsimport.json

```
TODO 

- [] Load the xls files


### Thanks to EPA for the water data! 
[Water data](https://drive.google.com/file/d/0B430LEzM9ITBbHVxSExkbUJqTjg/view?usp=sharing)

