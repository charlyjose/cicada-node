module.exports = {
    Error(res, Title, Heading, Subtitle, Body, Diagnose, Comments, ReturnLink) {
        console.log('\n\n')

        res.render('messageBoard', {
            title: Title,
            heading: Heading,
            subtitle: Subtitle,
            body: Body,
            diagnose: Diagnose,
            comments: Comments,
            returnLink: ReturnLink
        });
    }
}