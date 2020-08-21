var express = require('express');
const categoryModel = require('../models/category.model');
const bookModel = require('../models/book.model');
const userModel = require('../models/nguoidung.model');
const moment=require('moment')

const auth = require('../middlewares/auth.mdw')
const sleep = require('sleepjs')
var router = express.Router();


router.get('/:id', async(req, res) => {
    const ID = req.params.id;
    const [book] = await Promise.all(
        [bookModel.single(ID)
        ]);
    if (!book)
        return res.redirect('/err');
        
    const [name, alikebook] = await Promise.all(
        [categoryModel.single(book.category),
            bookModel.popularByCat(book.category)
        ]);
    bidScore = 0;
    if (auction.length != 0)
        bidScore = await userModel.getScore(auction[0].Bidder)
    i = 1;

    auction.forEach(async element => {
        element.STT = i;
        i++;
    })
    auction.forEach(async element => {
        element.Name = await userModel.singleByUserName(element.Bidder);
        element.Name = "****" + element.Name.Name.substr(element.Name.Name.length - 4);
    });
    if (req.session.isAuthenticated)
        alikebook.forEach(j => {
            favoriteList.forEach(k => {
               // console.log(k)
                if (k.User == req.session.authUser.Username && k.book == j.id)
                    j.isFavorite = true;
            });
        });
 //   console.log(favoriteList);
    subIMG = [];
    for (i = 1; i <= book.ImageCount; i++) {
        subIMG.push({
            id: book.id,
            id: i
        })
    };
    isBan = []
    if (req.session.authUser)
        isBan = await bannedModel.isBan(req.session.authUser.Username, ID);
    isSelling = (book.EndTime >= new Date()) && (book.Status == 0) && isBan.length == 0;
    isMybook = false;
    if (req.session.authUser)
        isMybook = (book.Seller == req.session.authUser.Username);
    res.render('detail', {
        ID,
        title: book.Name,
        book,
        auction,
        subIMG,
        properties,
        name,
        bidScore,
        sellScore,
        alikebook,
        isMybook,
        Borrow: req.query.Borrow || false,
        isSelling
    });
})

router.post('/:id/Borrow', auth, async(req, res) => {
    const list = userModel.all();
    [book, score] = await Promise.all(
        [
            bookModel.single(req.params.id),
            userModel.getScore(req.session.authUser.Username)
        ]);
    res.type('html');
    res.charset = 'utf-8';

    if (book.Seller == req.session.authUser.Username)
        return res.send('Your book')
    if (book.Public == 1 && score < 0.8)
        return res.send('Low Score');
    if (+req.body.Price < +book.Price + (+book.StepPrice))
        return res.send("Low Price");
    if (book.EndTime < new Date())
        return res.send("Time Up");
    if (book.Status == 1)
        return res.send("Sold Out")
    if (book.InstancePrice != null)
        if (+req.body.Price >= book.InstancePrice)
            return res.send("Buy");
    book.BorrowTime = +book.BorrowTime + 1;
    if (entity)
        if (+req.body.Price > +entity.Price) {
           // console.log(+req.body.Price, +entity.Price)
            book.Price = +entity.Price + (+req.body.StepPrice);
            book.PriceHolder = req.session.authUser.Username;
            await Promise.all(
                [
                    auctionModel.patchHighestPrice({
                        book: req.params.id,
                        User: req.session.authUser.Username,
                        Price: +req.body.Price
                    }),
                    auctionModel.add({
                        book: req.params.id,
                        Bidder: req.session.authUser.Username,
                        Price: book.Price,
                        Time: new Date()
                    }),
                    bookModel.patch(book)
                ]);
        } else {
            if (req.session.authUser.Username == book.PriceHolder)
                return res.send("Price Holder")
            book.Price = +req.body.Price + (+book.StepPrice);
            await auctionModel.add({
                book: req.params.id,
                Bidder: req.session.authUser.Username,
                Price: +req.body.Price,
                Time: new Date()
            });
            await (sleep(1000))
            await Promise.all(
                [
                    auctionModel.add({
                        book: req.params.id,
                        Bidder: entity.User,
                        Price: book.Price,
                        Time: new Date()
                    }),
                    bookModel.patch(book),
                ]);
        }
    else {
        book.Price = +book.Price + (+book.StepPrice);
        book.PriceHolder = req.session.authUser.Username;
        await Promise.all(
            [
                auctionModel.addHighestPrice({
                    book: req.params.id,
                    User: req.session.authUser.Username,
                    Price: +req.body.Price
                }),
                auctionModel.add({
                    book: req.params.id,
                    Bidder: req.session.authUser.Username,
                    Price: book.Price,
                    Time: new Date()
                }),
                bookModel.patch(book),
            ])
    }
    res.status(200);
    mailerModel.sendEmail(req, res, req.session.authUser.Email, "Đấu giá thành công!", "Chúc mừng bạn đấu giá thành công!");
    res.send("Success");
});

router.get('/:id/Buy', auth, async(req, res) => {
    book = await bookModel.single(req.params.id);
    score = await userModel.getScore(req.session.authUser.Username);

    if (book.Seller == req.session.authUser.Username)
        return res.send('Your book')
    if (!book.InstancePrice)
        return res.send('No Instance Price')
    if (book.Public == 0 && score < 0.8)
        return res.send('Low Score');
    if (book.EndTime < new Date())
        return res.send("Time Up");
    if (book.Status == 1)
        return res.send("Sold Out")
    book.Status = 1;
    await Promise.all(
        [bookModel.patch(book),
            cartModel.add({
                User: req.session.authUser.Username,
                book: req.params.id
            })
        ]);
    res.send("Success");
});

router.get('/:id/ban', async(req, res) => {
    await bannedModel.add({
        Username: req.query.Username,
        book: req.params.id
    })
    book = await bookModel.single(req.params.id);
    if (book.PriceHolder == req.session.authUser.Username) {
        auction = await auctionModel.getBorrowByid(req.params.id);
        console.log(auction[0])
        kt = false;
        for (i = 0; i < auction.length; i++) {
            check = await bannedModel.isBan(auction[i].Bidder, req.params.id);
            if (check.length == 0) {
                book.PriceHolder = auction[i].Bidder;
                book.Price = auction[i].Price;
                kt = true
            }
        }
        if (!kt) {
            book.Price = book.StartPrice;
            book.PriceHolder = null;
        }
        await bookModel.patch(book);
    }
    user=await userModel.singleByUserName(req.query.Username);
    mailerModel.sendEmail(req, res, user.Email, "Đấu giá thành công!", "Chúc mừng bạn đấu giá thành công!");
    res.send('success');
})

router.post('/:id/addDescription',async (req,res)=>{
    book=await bookModel.single(req.params.id);
    book.Description=book.Description+'\n'+moment().format('DD/MM/YYYY hh:mm')+'\n'+req.body.Description;
    await bookModel.patch(book);
    res.send('success')
})
module.exports = router;