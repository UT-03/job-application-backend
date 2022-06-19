const checkIsProfileComplete = (profile) => {
    const fields = ['name', 'email', 'phoneNumber', 'maritalStatus', 'noOfChildren', 'countryOfResidence', 'provinceOfCanadaWhereInterestedToWork', 'statusInCountryOfResidence', 'areaOfInterest', 'workExperience', 'highestLevelOfEducation', 'nameOfReference1', 'emailOfReference1', 'phoneNumberOfReference1', 'nameOfReference2', 'emailOfReference2', 'phoneNumberOfReference2', 'nameOfReference3', 'emailOfReference3', 'phoneNumberOfReference3'];

    let isComplete = true;
    let noOfFields = fields.length;
    let i = 0;

    while (i < noOfFields && isComplete) {
        if (!profile[fields[i]] || profile[fields[i]] === '') {
            isComplete = false;
            console.log(fields[i])
        }

        i++;
    }

    return isComplete;
}

module.exports = {
    checkIsProfileComplete
}