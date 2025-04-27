export const searchAndFilter = async({sorting,sorttype,limit,search,filterdata,offset=0}) =>{
    const queryParams = [];
    let sql_search = '';
    let sql_filters = '';
    let sql_sorting = '';
    let sql_limit = '';
    let sql_offset = '';

    //? search condition
    if (search) {
        try {
            const parsedSearch = JSON.parse(search);
            for (const [field, options] of Object.entries(parsedSearch)) {
                if (options?.value) {
                    //? case ที่เป็น date
                    if (options.type === 'date') {
                        sql_search += ` AND DATE(${field}) = DATE(?)`;
                        queryParams.push(options.value);
                    } else {
                        sql_search += ` AND ${field} = ?`;
                        queryParams.push(options.value);
                    }
                }
            }
        } catch (error) {
            console.error('Invalid Value', error);
        }
    }

    //? filter condition
    if (filterdata && typeof filterdata === 'object') {
        for (const [key, value] of Object.entries(filterdata)) {
            if (value !== undefined && value !== '') {
                sql_filters += ` AND ${key} = ?`;
                queryParams.push(value);
            }
        }
    }

    //? sort condition
    if(sorting || sorttype){
        const sort_type = sorttype?.toUpperCase() || 'ASC'
        const sort_value = sorting || 'id'
        sql_sorting = `ORDER BY ${sort_value} ${sort_type}`
    }

    //? limit condition
    if(limit){
        sql_limit = `LIMIT ?`
        queryParams.push(Number(limit));
    }

    //? offset condition
    if(offset){
        sql_offset = `OFFSET ?`
        queryParams.push(Number(offset));

    }

    const finalQueryPart = `
        ${sql_search}
        ${sql_filters}
        ${sql_sorting}
        ${sql_limit}
        ${sql_offset}
    `.trim();

    return {
        query: finalQueryPart,
        params: queryParams
    };

}