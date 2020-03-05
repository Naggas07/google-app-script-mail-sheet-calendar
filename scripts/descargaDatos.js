function descarga() {
    const DocuActual = SpreadsheetApp.openById('1pYSO3UIeiWY0T6miNNCtaOB8SboE6GSjjl0WSDfVhtU');
    const descarga = DocuActual.getSheetByName('Descarga de los datos');
    
    const planiCalendarioId = 'carrefour.com_qqvhp86uv2rbmr3ampco81thrs@group.calendar.google.com';
    const calendario = CalendarApp.getCalendarById(planiCalendarioId);
    
    let date = new Date(2020,2,1)
    let endDay = new Date(2020, 2, 30)
    
    let events = calendario.getEvents(date,endDay)
    let detail = events.map(event => eventDetail(event))
    
    
    detail.map((event, i) => {
      descarga.getRange(2+i, 1).setValue(event.titulo)
      descarga.getRange(2+i, 2).setValue(event.descripcion)  
      descarga.getRange(2+i, 3).setValue(event.inicio)  
      descarga.getRange(2+i, 4).setValue(event.fin)
      descarga.getRange(2+i, 5).setValue(event.id)  
    })
  }
  
  
  function eventDetail(event){
    let eventDetail = {
      titulo: event.getTitle(),
      descripcion: event.getDescription(),
      inicio: event.getStartTime(),
      fin: event.getEndTime(),
      id: event.getId()
    }
    return eventDetail
  }