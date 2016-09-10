
const mailFilter = (validMails) => (mail) => {
    // check if the TO: field contains one of DEST_MAILS
    const dest = mail.to
        .map((to) => to.address)
        .filter((addr) => validMails.includes(addr));

    return dest.length > 0;
};

module.exports = mailFilter;
