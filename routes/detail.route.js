var express = require('express');
const theloaiModel = require('../models/theloai.model');
const sachModel = require('../models/book.model');
const userModel = require('../models/nguoidung.model');
const moment=require('moment')

const auth = require('../middlewares/auth.mdw')
const sleep = require('sleepjs')
var router = express.Router();


router.get('/:id', async(req, res) => {
    const ID = req.params.id;
    const [sach] = await Promise.all(
        [sachModel.single(ID)
        ]);
    if (!sach)
        return res.redirect('/err');
        
    const [catName, alikeSach] = await Promise.all(
        [theloaiModel.single(sach.Theloai),
            sachModel.popularByCat(sach.Theloai)
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
        alikeSach.forEach(j => {
            favoriteList.forEach(k => {
               // console.log(k)
                if (k.User == req.session.authUser.Username && k.Sach == j.SachID)
                    j.isFavorite = true;
            });
        });
 //   console.log(favoriteList);
    subIMG = [];
    for (i = 1; i <= sach.ImageCount; i++) {
        subIMG.push({
            SachID: sach.SachID,
            id: i
        })
    };
    isBan = []
    if (req.session.authUser)
        isBan = await bannedModel.isBan(req.session.authUser.Username, ID);
    isSelling = (sach.EndTime >= new Date()) && (sach.Status == 0) && isBan.length == 0;
    isMySach = false;
    if (req.session.authUser)
        isMySach = (sach.Seller == req.session.authUser.Username);
    res.render('detail', {
        ID,
        title: sach.Name,
        sach,
        auction,
        subIMG,
        properties,
        catName,
        bidScore,
        sellScore,
        alikeSach,
        isMySach,
        Borrow: req.query.Borrow || false,
        isSelling
    });
})

router.post('/:id/Borrow', auth, async(req, res) => {
    const list = userModel.all();
    [sach, score] = await Promise.all(
        [
            sachModel.single(req.params.id),
            userModel.getScore(req.session.authUser.Username)
        ]);
    res.type('html');
    res.charset = 'utf-8';

    if (sach.Seller == req.session.authUser.Username)
        return res.send('Your sach')
    if (sach.Public == 1 && score < 0.8)
        return res.send('Low Score');
    if (+req.body.Price < +sach.Price + (+sach.StepPrice))
        return res.send("Low Price");
    if (sach.EndTime < new Date())
        return res.send("Time Up");
    if (sach.Status == 1)
        return res.send("Sold Out")
    if (sach.InstancePrice != null)
        if (+req.body.Price >= sach.InstancePrice)
            return res.send("Buy");
    sach.BorrowTime = +sach.BorrowTime + 1;
    if (entity)
        if (+req.body.Price > +entity.Price) {
           // console.log(+req.body.Price, +entity.Price)
            sach.Price = +entity.Price + (+req.body.StepPrice);
            sach.PriceHolder = req.session.authUser.Username;
            await Promise.all(
                [
                    auctionModel.patchHighestPrice({
                        Sach: req.params.id,
                        User: req.session.authUser.Username,
                        Price: +req.body.Price
                    }),
                    auctionModel.add({
                        Sach: req.params.id,
                        Bidder: req.session.authUser.Username,
                        Price: sach.Price,
                        Time: new Date()
                    }),
                    sachModel.patch(sach)
                ]);
        } else {
            if (req.session.authUser.Username == sach.PriceHolder)
                return res.send("Price Holder")
            sach.Price = +req.body.Price + (+sach.StepPrice);
            await auctionModel.add({
                Sach: req.params.id,
                Bidder: req.session.authUser.Username,
                Price: +req.body.Price,
                Time: new Date()
            });
            await (sleep(1000))
            await Promise.all(
                [
                    auctionModel.add({
                        Sach: req.params.id,
                        Bidder: entity.User,
                        Price: sach.Price,
                        Time: new Date()
                    }),
                    sachModel.patch(sach),
                ]);
        }
    else {
        sach.Price = +sach.Price + (+sach.StepPrice);
        sach.PriceHolder = req.session.authUser.Username;
        await Promise.all(
            [
                auctionModel.addHighestPrice({
                    Sach: req.params.id,
                    User: req.session.authUser.Username,
                    Price: +req.body.Price
                }),
                auctionModel.add({
                    Sach: req.params.id,
                    Bidder: req.session.authUser.Username,
                    Price: sach.Price,
                    Time: new Date()
                }),
                sachModel.patch(sach),
            ])
    }
    res.status(200);
    mailerModel.sendEmail(req, res, req.session.authUser.Email, "Đấu giá thành công!", "Chúc mừng bạn đấu giá thành công!");
    res.send("Success");
});

router.get('/:id/Buy', auth, async(req, res) => {
    sach = await sachModel.single(req.params.id);
    score = await userModel.getScore(req.session.authUser.Username);

    if (sach.Seller == req.session.authUser.Username)
        return res.send('Your sach')
    if (!sach.InstancePrice)
        return res.send('No Instance Price')
    if (sach.Public == 0 && score < 0.8)
        return res.send('Low Score');
    if (sach.EndTime < new Date())
        return res.send("Time Up");
    if (sach.Status == 1)
        return res.send("Sold Out")
    sach.Status = 1;
    await Promise.all(
        [sachModel.patch(sach),
            cartModel.add({
                User: req.session.authUser.Username,
                Sach: req.params.id
            })
        ]);
    res.send("Success");
});

router.get('/:id/ban', async(req, res) => {
    await bannedModel.add({
        Username: req.query.Username,
        Sach: req.params.id
    })
    sach = await sachModel.single(req.params.id);
    if (sach.PriceHolder == req.session.authUser.Username) {
        auction = await auctionModel.getBorrowBySachId(req.params.id);
        console.log(auction[0])
        kt = false;
        for (i = 0; i < auction.length; i++) {
            check = await bannedModel.isBan(auction[i].Bidder, req.params.id);
            if (check.length == 0) {
                sach.PriceHolder = auction[i].Bidder;
                sach.Price = auction[i].Price;
                kt = true
            }
        }
        if (!kt) {
            sach.Price = sach.StartPrice;
            sach.PriceHolder = null;
        }
        await sachModel.patch(sach);
    }
    user=await userModel.singleByUserName(req.query.Username);
    mailerModel.sendEmail(req, res, user.Email, "Đấu giá thành công!", "Chúc mừng bạn đấu giá thành công!");
    res.send('success');
})

router.post('/:id/addDescription',async (req,res)=>{
    sach=await sachModel.single(req.params.id);
    sach.Description=sach.Description+'\n'+moment().format('DD/MM/YYYY hh:mm')+'\n'+req.body.Description;
    await sachModel.patch(sach);
    res.send('success')
})
module.exports = router;