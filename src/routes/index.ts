import { Router } from "express";
import { healthRoutes } from "../modules/health/health.route";
import { authRoutes } from "../modules/auth/auth.route";
import { companyRoutes } from "../modules/company/company.route";
import { cmsRoutes } from "../modules/cms/cms.route";
import { contactRoutes } from "../modules/contact/contact.route";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/company", companyRoutes)
router.use("/cms", cmsRoutes)
router.use("/contact", contactRoutes)

export const apiRoutes = router;
