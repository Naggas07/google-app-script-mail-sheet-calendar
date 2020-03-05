function mantenerCalendario(){
    const calendarioId = 'carrefour.com_vj8bgj9d60h1pmtmvpsrjrio60@group.calendar.google.com';
    const calendario = CalendarApp.getCalendarById(calendarioId);
    
    const DocuActual = SpreadsheetApp.openById('1pYSO3UIeiWY0T6miNNCtaOB8SboE6GSjjl0WSDfVhtU');
    const hoja = DocuActual.getSheetByName('Pruebas');
    
    let maxLines = hoja.getDataRange().getLastRow()
    
    let rangoDatos = hoja.getRange(`A2:Q${maxLines}`).getValues()
    
    // formateamos el array con un array de objetos 
    let transformation = rangoDatos.map(line => setEvent(line))
    
    // creacion, actualización y eliminación automática. Queda pendiente los colores ¿Son necesarios?
    transformation.map((event, i) => {
    if(event.toDelete === 'SI' && event.id){
      borrarEvento(event, calendario, hoja, i+2)
    }else{
      if(event.toDelete === 'SI' && !event.id){
        
      }else{
        if(!event.id){
          crearEventoDia(event, calendario, hoja, i+2)
        }else{
          actualizarEvento(event, calendario, hoja, i+2)
        }
      }                 
    }                  
    } )
    
  }
  
  // *****************************************************************************************************************************************************************
  
  function saveMonth(){
    const calendarioId = 'carrefour.com_vj8bgj9d60h1pmtmvpsrjrio60@group.calendar.google.com';
    const calendario = CalendarApp.getCalendarById(calendarioId);
    
    const DocuActual = SpreadsheetApp.openById('1pYSO3UIeiWY0T6miNNCtaOB8SboE6GSjjl0WSDfVhtU');
    const hoja = DocuActual.getSheetByName('Pruebas');
    
    //pendiente de como ver el salvado de mes para que no perdamos todo lo que hemos realizado
    
    
  }
  
  
  // *****************************************************************************************************************************************************************
  
  function onOpen() {
    const spreadsheet = SpreadsheetApp.openById('1pYSO3UIeiWY0T6miNNCtaOB8SboE6GSjjl0WSDfVhtU');
    const menuItems = [{name: 'Actualizar', functionName: 'mantenerCalendario'}];
    spreadsheet.addMenu('Calendario', menuItems);
  }
  
  // *****************************************************************************************************************************************************************
  
  function actualizarEvento(event, calendar, hojaRellenar, line) {
    let globalDescription = setDescription(event)
    
    const eventDay = calendar.getEventById(event.id)
    eventDay.setAllDayDate(event.start)
    .setDescription(globalDescription)
    .setTitle(event.name)
    
   
    
    
  }
  
  // *****************************************************************************************************************************************************************
  function crearEventoDia(event, calendar, hojaRellenar, line){
    let globalDescription = setDescription(event)
    
   const created =  calendar.createAllDayEvent(event.name, event.start, {description: globalDescription})
   const id = created.getId()
  
   hojaRellenar.getRange(`M${line}`).setValue(created.getId())
   
  }
  
  // *****************************************************************************************************************************************************************
  
  function borrarEvento(event, calendar, hojaRellenar, line){
    const eventToDelete = calendar.getEventById(event.id)
    
    hojaRellenar.getRange(`M${line}`).setValue('')
    eventToDelete.deleteEvent()
    
  }
  
  // ^***************************************************************************************************************************************************************
  
  function setUser(data){
    let user = {
      nombre: data[1],
      email: data[0]
    }
    
    return user
  }
  
  // ^***************************************************************************************************************************************************************
  
  function envioCorreoPlantilla(plantilla, user, list, dia){
    plantilla.dia = dia
    plantilla.list = list
    let mensaje = plantilla.evaluate().getContent()
   
    
    MailApp.sendEmail({
      to: user.email,
      subject: `Envios Marketing semama actual`,
      htmlBody: mensaje 
    });
    
  }
  
  // *****************************************************************************************************************************************************************
  function setEvent(data){
    let event ={
      id: data[12],
      name: data[0],
      squad: data[1],
      comments: data[2],
      start: new Date(data[3]),
      end: new Date(data[4]),
      compliance: data[5],
      creativity: data[6],
      segment: data[7],
      stimatedNumber: data[8],
      data: data[9],
      channels: data[10],
      objetive: data[11],
      realDate: data[13],
      realVolume: data[14],
      smsText: data[15],
      toDelete: data[16]
    }
    return event
  }
  
  // *****************************************************************************************************************************************************************
  
  function setDescription(event){
    let Description = ` -Squad: ${event.squad}
    -Segmento: ${event.segment}
    -Canales: ${event.channels}
    -Compliance: ${event.compliance}
    -Creatividad: ${event.creativity}
    -Data: ${event.data}
    -Objetivo: ${event.objetive}
    -Comentarios: ${event.comments}
    -Volumen estimado: ${event.stimatedNumber}
    
    -SMS Si existe: ${event.smsText}`
    
    return Description
  }
  