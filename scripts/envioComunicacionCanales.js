function enviosMasivos() {
    const DocuActual = SpreadsheetApp.openById('1kCqDC0gHcACrnx-3Gqs2osycK3LPcLCmXnnWeEA4bNE');
    const libroDatosEnvios = DocuActual.getSheetByName('DatosDeEnvio');
    let maxColumns = libroDatosEnvios.getDataRange().getLastColumn()
    let maxLines = libroDatosEnvios.getDataRange().getLastRow()
    let datos = libroDatosEnvios.getRange(2,1,maxLines, maxColumns).getValues();
    
    // pruebas
    let plantilla = HtmlService.createTemplateFromFile('prueba1');
    let lista = calendar()
    
    for(let  i = 0; i < datos.length; i++){
      let agente = createAgent(datos[i])
      if(agente.email){
      envioCorreo(plantilla, agente, lista)
      }
    }
  }
  
  // ********************************************************************************************
  
  function onOpen() {
    const spreadsheet = SpreadsheetApp.openById('1kCqDC0gHcACrnx-3Gqs2osycK3LPcLCmXnnWeEA4bNE');
    const menuItems = [{name: 'Enviar', functionName: 'enviosMasivos'}];
    spreadsheet.addMenu('Enviar Correos', menuItems);
  }
  
  // ********************************************************************************************
  
  function createAgent(data){
    const agente ={
      nombre: data[1],
      email: data[0],
      parrafo: 'Hola desde el script',
      img: 'https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png'
    }
    return agente
  }
  
  // ********************************************************************************************
  
  function envioCorreo(plantilla, agente, list, dia){
    plantilla.dia = dia,
    plantilla.agente = agente,
    plantilla.list = list
    let mensaje = plantilla.evaluate().getContent()
   
    
    MailApp.sendEmail({
      to: agente.email,
      subject: `Envios Marketing semama actual`,
      htmlBody: mensaje 
    });
    
  }
  
  
  // ********************************************************* prueba de datos *************************************************************
  
  function calendar() {
    const planiCalendarioId = 'carrefour.com_qqvhp86uv2rbmr3ampco81thrs@group.calendar.google.com';
    const calendario = CalendarApp.getCalendarById(planiCalendarioId);
    
    const excelCalendario = SpreadsheetApp.openById('1pYSO3UIeiWY0T6miNNCtaOB8SboE6GSjjl0WSDfVhtU')
    
    let date = new Date()
    let day = date.getDay()
    let endDay = new Date(date.getFullYear(), date.getMonth(), date.getDay()+6)
    let year = date.getFullYear()
    
    let events = calendario.getEvents(date,endDay)
    
    let eventsArray = events.map(event => formateaEvento(event))
    
    //let event = calendario.createEvent(titulo, new Date(start), new Date(end))
    
    //calendario.createAllDayEvent('prueba', new Date(year, month, day+2))
    
    return eventsArray
    }
  
  
  
  
  function formateaEvento(event){
    let infoEvent = {
      titulo: event.getTitle(),
      descripcion: event.getDescription(),
      dia: event.getStartTime().getDay(),
      mes: event.getStartTime().getMonth()+1,
      anio:event.getStartTime().getFullYear()
    }
    return infoEvent
  }