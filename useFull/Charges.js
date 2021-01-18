import { Alert } from "react-native"




const FindNextJun = (inputDate)=>{
    
    let junDateToSec = (new Date(inputDate.getFullYear(),4,31,13,0,0))
    if(inputDate-(new Date(inputDate.getFullYear(),4,31,13,0,0)) >= 0){
        return(new Date(junDateToSec.getFullYear()+1,4,31,13,0,0))
    }
    else {
        return(new Date(junDateToSec.getFullYear(),4,31,13,0,0))
    }
}
const AppCharges = (Appartement) => {
    let Total = 0 ;
    let Charges = [];
    let today = new Date()
    today.setUTCHours(0, 0, 0, 0);
    let NextJunFromToDayTimeStamp = FindNextJun(today).getTime()
    // synchronization with server************************
    Appartement.DateDeSignatureDuContrat.seconds += 3600 ;
    // ***************************************************     

    if(typeof(Appartement) !== "undefined"){

        let ContractTimeStamp = Appartement.DateDeSignatureDuContrat.toDate().getTime()
        let ContractnextJuneTimeStamp = FindNextJun(Appartement.DateDeSignatureDuContrat.toDate()).getTime()
        do{
            let Ndays = 0
            let x = (ContractnextJuneTimeStamp-ContractTimeStamp)/(1000*60*60*24)
            if(x>363){
                Ndays = 365
            }else{
                Ndays = Math.floor(x)
            }
            if(Math.floor( Ndays*(4850/365) ) !== 0 ){
                Charges.push({
                    days : Ndays,
                    charge : Math.floor( Ndays*(4850/365) ),
                    saison : (new Date(ContractnextJuneTimeStamp-(1000*365*60*60*24))).getFullYear()+"/"+(new Date(ContractnextJuneTimeStamp)).getFullYear(),
                    startingDay: (JSON.stringify(new Date(ContractTimeStamp))).split('"')[1].split('T')[0],
                    To: (JSON.stringify(new Date(ContractnextJuneTimeStamp))).split('"')[1].split('T')[0]
                })
                Total += Math.floor( (ContractnextJuneTimeStamp-ContractTimeStamp)/(1000*60*60*24)*(4850/365) )    
            }
            
            let x1 = new Date(ContractnextJuneTimeStamp)
            ContractTimeStamp = x1.setDate(x1.getDate()+1)
            ContractnextJuneTimeStamp = FindNextJun(new Date(ContractnextJuneTimeStamp)).getTime() 
        }while(ContractnextJuneTimeStamp <= NextJunFromToDayTimeStamp)
    }
    return({Total,Charges})

}
const AllCharges = (user) => {
    let Appartments = []
    let Total = 0
    let today = new Date()
    today.setUTCHours(0, 0, 0, 0);
    let NextJunFromToDayTimeStamp = FindNextJun(today).getTime()
    if(typeof(user.proprietaireDe) !== "undefined"){
        user.proprietaireDe.map((appartment,i)=>{
            let app = {
                proprietaire : {
                    uid : user.uid,
                    nom : user.nom,
                    prenom : user.prenom,
                    cin : user.cin
                },
                titreFoncier : appartment.titreFoncier,
                Immeuble: appartment.Immeuble,
                NAppartement: appartment.NAppartement,
                ChargesList : [],
                Total : 0
            }
            // synchronization************************************
            appartment.DateDeSignatureDuContrat.seconds += 3600 ;
            // *************************************************** 
            let ContractTimeStamp = appartment.DateDeSignatureDuContrat.toDate().getTime()
            let ContractnextJuneTimeStamp = FindNextJun(appartment.DateDeSignatureDuContrat.toDate()).getTime()

            
            do{
                
                let Ndays = 0
                let x = (ContractnextJuneTimeStamp-ContractTimeStamp)/(1000*60*60*24)
                if(x>363){
                    Ndays = 365
                }else{
                    Ndays = Math.floor(x)
                }
                if(Math.floor( Ndays*(4850/365) ) !== 0 ){
                    app["ChargesList"].push({
                    days : Ndays,
                    charge : Math.floor( Ndays*(4850/365) ),
                    saison : (new Date(ContractnextJuneTimeStamp-(1000*365*60*60*24))).getFullYear()+"/"+(new Date(ContractnextJuneTimeStamp)).getFullYear(),
                    startingDay: (JSON.stringify(new Date(ContractTimeStamp))).split('"')[1].split('T')[0],
                    To: (JSON.stringify(new Date(ContractnextJuneTimeStamp))).split('"')[1].split('T')[0]
                    })
                    app["Total"] += Math.floor( (ContractnextJuneTimeStamp-ContractTimeStamp)/(1000*60*60*24)*(4850/365) )
                    Total += Math.floor( (ContractnextJuneTimeStamp-ContractTimeStamp)/(1000*60*60*24)*(4850/365) )
                }
                


                let x1 = new Date(ContractnextJuneTimeStamp)

                

                
                ContractTimeStamp = (new Date(x1.getFullYear(),5,1,13,0,0)).getTime()
                
                ContractnextJuneTimeStamp = FindNextJun(new Date(ContractnextJuneTimeStamp)).getTime()
                // let X = new Date(ContractnextJuneTimeStamp)
                // ContractTimeStamp = X.setMonth(5)
                // ContractTimeStamp += 1000*60*60*24
                
                // let Y = new Date(ContractnextJuneTimeStamp)
                // Y.setFullYear(Y.getFullYear()+1)

                // ContractnextJuneTimeStamp = Y.setMonth(5)
                // ContractnextJuneTimeStamp = Y.setDate(1);

            }while(ContractnextJuneTimeStamp <= NextJunFromToDayTimeStamp)
            
            
            Appartments.push(app)
        })
        
    }
    
    
        
    
    return({Appartments,Total})

}
export {AllCharges,AppCharges,FindNextJun}