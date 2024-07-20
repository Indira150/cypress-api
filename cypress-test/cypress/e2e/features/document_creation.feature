Feature: Crear Documento
    Scenario: Crear un nuevo documento y verificar en la base de datos
    Given Tengo la informacion del documento
    When Envio un POST request para crear el documento
    Then Deberia ver el documento en la base de datos