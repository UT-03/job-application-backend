const getAllJobPostings = async (req, res, next) => {
    const { pageNumber } = req.params;

    console.log(pageNumber);

    res.end();
}

module.exports = {
    getAllJobPostings
}