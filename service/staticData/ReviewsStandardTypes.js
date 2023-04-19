const reviewStandards = require('../../models/ReviewStandards')

class ReviewsStandardTypes{
    
    static review_types = null

    static async getAllReviewTypes(onlyIds){
           if(!this.review_types){
                 this.review_types = await reviewStandards.findAll()
           }
          if(onlyIds){
               return this.review_types.map((standards) => standards.id)
          } else{
            return this.review_types
          }  
    }

    static async validateReviewIds(reviewIds){
          const result = await this.getAllReviewTypes(true)
          return reviewIds.every((id) => result.includes(+id))    
    }


}

module.exports = ReviewsStandardTypes