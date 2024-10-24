const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    let name = "Ruhban";
    fs.readdir(`./files`, (err, files) => {
        (err) ? console.error(err) : res.render("index", { files: files, name: name });
    });
});

app.post('/create', (req, res) => {
    // res.render("index", {name: req.params.username});
    let title = req.body.title;
    let description = req.body.description;

    fs.writeFile(`files/${title.split(' ').join('-')}.txt`, description, (err) => {
        (err) ? res.send(err) :  res.redirect('/');
    });

});

app.get('/read/:filename', (req, res) => {
    let title = req.params.filename;
    fs.readFile(`./files/${title}`, 'utf-8', (err, data) => {
        (err) ? console.error(err) : res.render('readmore', {
            description: data,
            title
        });
    });
    // res.render('readmore', {description: description});
});

app.get('/update/:filename', (req, res) => {
    let title = req.params.filename;
    res.render("update", { filename: title });
    let newName = req.body.new;
    fs.rename(`./files/${title}`, newName, (err) => { (err) ? console.error(err) :  res.redirect('/'); });

});

app.post('/edit', (req, res) => {
    let title = req.body.previousname;
    let newName = req.body.new;
    // console.log(`Previous name: ${title}\nNew Name: ${newName}`);
    fs.rename(`./files/${title}`, `./files/${newName.split(' ').join('-')}.txt`, (err) => {
        (err) ? console.error(err) :  res.redirect('/');
    });

});

app.get('/delete/:filename', (req, res) => {
    let title = req.params.filename;
    fs.unlink(`./files/${title}`, (err) => {
        (err) ? res.send(err) : res.send(` ${title}, Deleted Successfully!`);
    });
});


app.listen(3000);