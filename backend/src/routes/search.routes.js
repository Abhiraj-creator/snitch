import express, { Router } from 'express'
import { Searchproduct } from '../controller/search.controller.js'
const router= Router()

/**
 * @route POST /api/search
 * @desc search products
 * @access public
 */
router.get('/',Searchproduct)


export default router