const statusType = require('../../models/ReportStatus')

class StatusType{

    static reportStatusType = null
    static statusTypeOmitForEngineer = 4

    static async getAllStatusTypes(){
        if(!this.reportStatusType){
            this.reportStatusType = statusType.findAll({raw:true})
        }
       return this.reportStatusType
    }

    static async getAllStatusIds(){
        const statusTypes = await this.getAllStatusTypes()
        const statusIds = statusTypes.map((type) => type.id)
        console.log(statusIds)
        return statusIds
    }

    static async getEngineerNotificationStatusTypes(){
        const statusTypes = await this.getAllStatusTypes()
        console.log(statusTypes)
        return statusTypes.map((st) => st.id).filter((id) => id!==this.statusTypeOmitForEngineer)
    }

    static async getStatusNameFromId(id){
        const statusTypes = await this.getAllStatusTypes()
        return statusTypes.find((type)=> type.id===+id).name
    }

    static async validateStatusType(status_id){
        const statusTypes = await this.getAllStatusTypes()
        return statusTypes.find((type)=>type.id===status_id)
    }
}

module.exports = StatusType