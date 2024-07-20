import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('Tengo la informacion del documento', () => {
    cy.fixture('document').as('documentData');

});

When('Envio un POST request para crear el documento', function() {
    cy.get('@documentData').then((document) => {
        cy.request({
            method: 'POST',
            url: '/ob-sl-hurin/v1/payout/invoice',
            body: document,
            auth: {
                user: 'dc6c0b0a-b7a3-4adc-acf9-ef42ff191c9f',
                pass: 'sk_eeCM3rxKKkbXyguLPsBnkm'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.customer.bank_account.cci_str.length).to.eq(20);
            cy.wrap(response.body.invoice_id).as('invoiceId');
        });
    });
});

Then('Deberia ver el documento en la base de datos', function() {
    cy.get('@invoiceId').then((invoiceId) => {
        cy.task('findOne', { collection: 'invoice', query: { invoice_id: invoiceId }})
            .then((document) => {
                expect(document).to.exist;
            });
    })
})