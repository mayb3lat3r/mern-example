import Link from '../models/Link.js'
import { Router } from 'express'
const router = Router()


router.get('/:code', async (req, res) => {
    try {
        const link = await Link.findOne({ code: req.params.code })

        if (link) {
           link.clicks++
           await link.save()
           return res.redirect(link.from)
        }

        return res.status(404).json({message: 'Link is not found'})
    } catch (e) {
        res.status(500).json({ message: 'Something goes wrong' })
    }
})


export default router