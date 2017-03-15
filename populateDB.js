var allPassages = JSON.parse(fs.readFileSync('passages.json', 'utf8')).passages;
allPassages.forEach(function(passage) {
    var params = {
        TableName: "Passages",
        Item: {
            "id":  passage.id,
            "title": passage.title,
            "text":  passage.text,
            "mastered": passage.mastered,
            "currentPassage": passage.currentPassage,
            "reviewed": passage.reviewed,
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add passage", passage.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", passage.title);
       }
    });
});
